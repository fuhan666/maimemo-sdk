# 墨墨背单词 SDK 用户指南

## 目录

1. [简介](#简介)
2. [安装](#安装)
3. [基本用法](#基本用法)
4. [API参考](#api参考)
   - [初始化客户端](#初始化客户端)
   - [单词API](#单词api)
   - [释义API](#释义api)
   - [助记API](#助记api)
   - [云词本API](#云词本api)
   - [例句API](#例句api)
5. [错误处理](#错误处理)
   - [错误类型](#错误类型)
   - [通用错误码](#通用错误码)
   - [错误处理示例](#错误处理示例)
6. [高级特性](#高级特性)
   - [认证状态检查](#认证状态检查)
   - [请求重试](#请求重试)
7. [常见问题](#常见问题)

## 简介

墨墨背单词 SDK 是一个Node.js客户端库，用于与墨墨背单词API进行交互。通过这个SDK，你可以轻松地在自己的应用程序中集成墨墨背单词的功能。

## 安装

使用npm安装：

```bash
npm install maimemo-sdk
```

或使用yarn安装：

```bash
yarn add maimemo-sdk
```

## 基本用法

以下是使用SDK的基本示例：

```typescript
import { Maimemo } from 'maimemo-sdk';

// 初始化客户端
const client = new Maimemo('your-token-here');

// 查询单词
async function getWordDetails() {
  try {
    // 查询单词获取ID
    const vocabulary = await client.vocabulary.query('apple');
    console.log(`单词ID: ${vocabulary.id}, 拼写: ${vocabulary.spelling}`);

    // 获取单词的释义
    const interpretations = await client.interpretations.list(vocabulary.id);
    console.log('释义列表:', interpretations);

    // 获取单词的助记
    const notes = await client.notes.list(vocabulary.id);
    console.log('助记列表:', notes);

    // 获取单词的例句
    const phrases = await client.phrases.list(vocabulary.id);
    console.log('例句列表:', phrases);
  } catch (error) {
    console.error('发生错误:', error);
  }
}

getWordDetails();
```

## API参考

### 初始化客户端

```typescript
const client = new Maimemo(token, options);
```

**参数:**

- `token: string` - API认证令牌
- `options?: MaimemoOptions` - 可选的SDK配置
  - `baseUrl?: string` - API基础URL，默认为'https://open.maimemo.com/open'
  - `headers?: Record<string, string>` - 自定义HTTP头

**示例:**

```typescript
const client = new Maimemo('your-token');
```

### 单词API

#### 查询单词

```typescript
const vocabulary = await client.vocabulary.query(spelling);
```

**参数:**

- `spelling: string` - 单词拼写

**返回:**

- `Promise<Vocabulary>` - 包含单词ID和拼写的对象

**示例:**

```typescript
// 根据拼写查询单词
const vocabulary = await client.vocabulary.query('apple');
console.log(vocabulary);
// 输出: { id: '5a7BFf4F63612e5AD9fdebB7a50D3881', spelling: 'apple' }
```

### 释义API

#### 获取释义列表

```typescript
const interpretations = await client.interpretations.list(vocId);
```

**参数:**

- `vocId: string` - 单词ID

**返回:**

- `Promise<Interpretation[]>` - 释义对象数组

**示例:**

```typescript
// 获取单词的释义列表
const interpretations = await client.interpretations.list('5a7BFf4F63612e5AD9fdebB7a50D3881');
```

#### 创建释义

```typescript
const interpretation = await client.interpretations.create({
  vocId: '单词ID',
  interpretation: '释义内容',
  tags: ['标签1', '标签2'],
  status: InterpretationStatus.PUBLISHED,
});
```

**参数:**

- `vocId: string` - 单词ID
- `interpretation: string` - 释义内容
- `tags: string[]` - 标签
- `status?: InterpretationStatus` - 状态，可选，默认PUBLISHED

**返回:**

- `Promise<Interpretation>` - 创建的释义对象

**示例:**

```typescript
// 为单词创建释义
const interpretation = await client.interpretations.create({
  vocId: '5a7BFf4F63612e5AD9fdebB7a50D3881',
  interpretation: 'n. 苹果',
  tags: ['考研'],
  status: InterpretationStatus.PUBLISHED,
});
```

#### 更新释义

```typescript
const updatedInterpretation = await client.interpretations.update('释义ID', {
  interpretation: '新释义内容',
  tags: ['新标签1', '新标签2'],
  status: InterpretationStatus.PUBLISHED,
});
```

**参数:**

- `id: string` - 释义ID
- `interpretation: string` - 释义内容
- `tags: string[]` - 标签
- `status?: InterpretationStatus` - 状态，可选

**返回:**

- `Promise<Interpretation>` - 更新后的释义对象

**示例:**

```typescript
// 更新释义
const updatedInterpretation = await client.interpretations.update('8f7e6d5c4b3a2190', {
  interpretation: 'n. 苹果',
  tags: ['考研', '四级'],
  status: InterpretationStatus.PUBLISHED,
});
```

#### 删除释义

```typescript
await client.interpretations.delete('释义ID');
```

**参数:**

- `id: string` - 释义ID

**示例:**

```typescript
// 删除释义
await client.interpretations.delete('8f7e6d5c4b3a2190');
```

### 助记API

#### 获取助记列表

```typescript
const notes = await client.notes.list(vocId);
```

**参数:**

- `vocId: string` - 单词ID

**返回:**

- `Promise<Note[]>` - 助记对象数组

**示例:**

```typescript
// 获取单词的助记列表
const notes = await client.notes.list('5a7BFf4F63612e5AD9fdebB7a50D3881');
```

#### 创建助记

```typescript
const note = await client.notes.create({
  vocId: '单词ID',
  noteType: '助记类型',
  note: '助记内容',
});
```

**参数:**

- `vocId: string` - 单词ID
- `noteType: string` - 助记类型
- `note: string` - 助记内容

**返回:**

- `Promise<Note>` - 创建的助记对象

**示例:**

```typescript
// 为单词创建助记
const note = await client.notes.create({
  vocId: '5a7BFf4F63612e5AD9fdebB7a50D3881',
  noteType: '谐音',
  note: '苹果的助记内容',
});
```

#### 更新助记

```typescript
const updatedNote = await client.notes.update('助记ID', {
  noteType: '新助记类型',
  note: '新助记内容',
});
```

**参数:**

- `id: string` - 助记ID
- `noteType: string` - 助记类型
- `note: string` - 助记内容

**返回:**

- `Promise<Note>` - 更新后的助记对象

**示例:**

```typescript
// 更新助记
const updatedNote = await client.notes.update('note-id-123', {
  noteType: '谐音',
  note: '更新后的助记内容',
});
```

#### 删除助记

```typescript
await client.notes.delete('助记ID');
```

**参数:**

- `id: string` - 助记ID

**示例:**

```typescript
// 删除助记
await client.notes.delete('note-id-123');
```

### 云词本API

#### 获取云词本列表

```typescript
const notepads = await client.notepads.list(limit, offset, ids);
```

**参数:**

- `limit: number` - 每页数量
- `offset: number` - 偏移量
- `ids?: string[]` - 可选，指定云词本ID列表

**返回:**

- `Promise<BriefNotepad[]>` - 简要云词本对象数组

**示例:**

```typescript
// 获取云词本列表
const notepads = await client.notepads.list(10, 0);

// 获取指定ID的云词本列表
const specificNotepads = await client.notepads.list(10, 0, ['id1', 'id2']);
```

#### 获取云词本详情

```typescript
const notepad = await client.notepads.get(id);
```

**参数:**

- `id: string` - 云词本ID

**返回:**

- `Promise<Notepad>` - 云词本详情对象

**示例:**

```typescript
// 获取云词本详情
const notepad = await client.notepads.get('notepad-id-123');
```

#### 创建云词本

```typescript
const notepad = await client.notepads.create({
  title: '云词本标题',
  description: '云词本描述',
  tags: ['标签1', '标签2'],
  words: ['单词1', '单词2'],
});
```

**参数:**

- `title: string` - 云词本标题
- `description?: string` - 云词本描述，可选
- `tags?: string[]` - 标签，可选
- `words?: string[]` - 单词列表，可选

**返回:**

- `Promise<Notepad>` - 创建的云词本对象

**示例:**

```typescript
// 创建云词本
const newNotepad = await client.notepads.create({
  title: '常用词汇',
  content: 'apple\nbanana\norange',
  brief: '常用水果单词',
  tags: ['水果', '基础词汇'],
  status: NotepadStatus.PUBLISHED,
});
```

#### 更新云词本

```typescript
const updatedNotepad = await client.notepads.update('云词本ID', {
  title: '新标题',
  description: '新描述',
  tags: ['新标签1', '新标签2'],
  addWords: ['添加单词1', '添加单词2'],
  removeWords: ['移除单词1', '移除单词2'],
});
```

**参数:**

- `id: string` - 云词本ID
- `title?: string` - 云词本标题，可选
- `description?: string` - 云词本描述，可选
- `tags?: string[]` - 标签，可选
- `addWords?: string[]` - 添加的单词列表，可选
- `removeWords?: string[]` - 移除的单词列表，可选

**返回:**

- `Promise<Notepad>` - 更新后的云词本对象

**示例:**

```typescript
// 更新云词本
const updatedNotepad = await client.notepads.update('notepad-id-123', {
  title: '常用词汇（更新）',
  content: 'apple\nbanana\norange\npear',
  brief: '常用水果单词（更新）',
  tags: ['水果', '基础词汇', '扩展'],
  status: NotepadStatus.PUBLISHED,
});
```

#### 删除云词本

```typescript
await client.notepads.delete('云词本ID');
```

**参数:**

- `id: string` - 云词本ID

**示例:**

```typescript
// 删除云词本
await client.notepads.delete('notepad-id-123');
```

### 例句API

#### 获取例句列表

```typescript
const phrases = await client.phrases.list(vocId);
```

**参数:**

- `vocId: string` - 单词ID

**返回:**

- `Promise<Phrase[]>` - 例句对象数组

**示例:**

```typescript
// 获取单词的例句列表
const phrases = await client.phrases.list('5a7BFf4F63612e5AD9fdebB7a50D3881');
```

#### 创建例句

```typescript
const phrase = await client.phrases.create({
  vocId: '单词ID',
  phrase: '例句内容',
  translation: '例句翻译',
  tags: ['标签1', '标签2'],
  source: '例句来源',
});
```

**参数:**

- `vocId: string` - 单词ID
- `phrase: string` - 例句内容
- `translation: string` - 例句翻译
- `tags?: string[]` - 标签，可选
- `source?: string` - 例句来源，可选

**返回:**

- `Promise<Phrase>` - 创建的例句对象

**示例:**

```typescript
// 为单词创建例句
const phrase = await client.phrases.create({
  vocId: '5a7BFf4F63612e5AD9fdebB7a50D3881',
  phrase: 'This is an apple.',
  interpretation: '这是一个苹果。',
  tags: ['基础', '简单'],
  origin: '自定义',
});
```

#### 更新例句

```typescript
const updatedPhrase = await client.phrases.update('例句ID', {
  phrase: '新例句内容',
  translation: '新例句翻译',
  tags: ['新标签1', '新标签2'],
  source: '新例句来源',
});
```

**参数:**

- `id: string` - 例句ID
- `phrase?: string` - 例句内容，可选
- `translation?: string` - 例句翻译，可选
- `tags?: string[]` - 标签，可选
- `source?: string` - 例句来源，可选

**返回:**

- `Promise<Phrase>` - 更新后的例句对象

**示例:**

```typescript
// 更新例句
const updatedPhrase = await client.phrases.update('phrase-id-123', {
  phrase: 'This is a red apple.',
  interpretation: '这是一个红苹果。',
  tags: ['基础', '简单', '颜色'],
  origin: '自定义',
});
```

#### 删除例句

```typescript
await client.phrases.delete('例句ID');
```

**参数:**

- `id: string` - 例句ID

**示例:**

```typescript
// 删除例句
await client.phrases.delete('phrase-id-123');
```

## 错误处理

### 错误类型

SDK中定义了以下错误类型：

- `MaimemoError` - 所有错误的基类
  - `ValidationError` - 参数验证错误
  - `AuthenticationError` - 认证错误
  - `NotFoundError` - 资源未找到
  - `APIError` - API服务器错误
  - `NetworkError` - 网络错误
  - `TimeoutError` - 请求超时错误

### 通用错误码

以下是API返回的常见HTTP状态码及其对应的SDK错误类型：

| 状态码 | 描述                 | SDK 错误类          |
| ------ | -------------------- | ------------------- |
| 400    | 请求参数错误         | ValidationError     |
| 401    | 未授权（Token 无效） | AuthenticationError |
| 404    | 资源未找到           | NotFoundError       |
| 429    | 请求频率过高         | APIError            |
| 500    | 服务器内部错误       | APIError            |
| 503    | 服务不可用           | APIError            |

### 错误处理示例

```typescript
try {
  const vocabulary = await client.vocabulary.query('nonexistent');
} catch (error) {
  if (error instanceof NotFoundError) {
    console.error('单词未找到');
  } else if (error instanceof AuthenticationError) {
    console.error('认证失败，请检查令牌');
  } else if (error instanceof ValidationError) {
    console.error('参数错误：', error.message);
  } else if (error instanceof APIError) {
    console.error('API服务器错误：', error.message, '状态码：', error.statusCode);
  } else if (error instanceof NetworkError) {
    console.error('网络错误：', error.message);
  } else if (error instanceof TimeoutError) {
    console.error('请求超时：', error.message);
  } else {
    console.error('未知错误：', error);
  }
}
```

## 高级特性

### 认证状态检查

可以使用SDK检查当前令牌的认证状态：

```typescript
// 检查用户认证状态
const isAuthenticated = await client.checkAuth();
if (isAuthenticated) {
  console.log('用户认证有效');
} else {
  console.log('用户认证无效，请更新token');
}
```

## 常见问题

### Q: 如何获取API令牌？

A: 您需要联系墨墨背单词官方获取API令牌。

### Q: API请求失败怎么办？

A: 首先检查您的网络连接和API令牌是否正确。如果问题依然存在，可以通过捕获并检查错误类型来确定具体问题。

### Q: 单词查询返回404错误？

A: 这通常表示您查询的单词不存在于墨墨背单词的数据库中。请确认拼写是否正确，或者尝试其他单词。

### Q: 如何处理API请求频率限制？

A: 当您遇到请求频率限制（状态码429）时，SDK会自动尝试重试请求。您可以通过配置选项调整重试策略。

### Q: SDK是否支持浏览器环境？

A: 当前版本主要针对Node.js环境优化，但支持现代浏览器。在浏览器中使用时，请注意跨域问题和认证安全性。
