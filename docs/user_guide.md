# 墨墨背单词 SDK 用户指南

## 目录

- [墨墨背单词 SDK 用户指南](#墨墨背单词-sdk-用户指南)
  - [目录](#目录)
  - [简介](#简介)
  - [安装](#安装)
  - [基本用法](#基本用法)
  - [API参考](#api参考)
    - [初始化客户端](#初始化客户端)
    - [单词API](#单词api)
      - [查询单词](#查询单词)
    - [释义API](#释义api)
      - [获取释义列表](#获取释义列表)
      - [创建释义](#创建释义)
      - [更新释义](#更新释义)
      - [删除释义](#删除释义)
    - [助记API](#助记api)
      - [获取助记列表](#获取助记列表)
      - [创建助记](#创建助记)
      - [更新助记](#更新助记)
      - [删除助记](#删除助记)
    - [云词本API](#云词本api)
      - [获取云词本列表](#获取云词本列表)
      - [获取云词本详情](#获取云词本详情)
      - [创建云词本](#创建云词本)
      - [更新云词本](#更新云词本)
      - [删除云词本](#删除云词本)
    - [例句API](#例句api)
      - [获取例句列表](#获取例句列表)
      - [创建例句](#创建例句)
      - [更新例句](#更新例句)
      - [删除例句](#删除例句)
  - [错误处理](#错误处理)
    - [错误类型](#错误类型)
    - [通用错误码](#通用错误码)
    - [错误处理示例](#错误处理示例)

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
- `tags: InterpretationTag[]` - 标签，必须从以下值中选择：'考研'、'简明'、'详细'、'英英'、'小学'、'初中'、'高中'、'四级'、'六级'、'专升本'、'专四'、'专八'、'考博'、'雅思'、'托福'、'托业'、'新概念'、'GRE'、'GMAT'、'BEC'、'MBA'、'SAT'、'ACT'、'法学'、'医学'
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
- `tags: InterpretationTag[]` - 标签，必须从以下值中选择：'考研'、'简明'、'详细'、'英英'、'小学'、'初中'、'高中'、'四级'、'六级'、'专升本'、'专四'、'专八'、'考博'、'雅思'、'托福'、'托业'、'新概念'、'GRE'、'GMAT'、'BEC'、'MBA'、'SAT'、'ACT'、'法学'、'医学'
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
- `noteType: NoteType` - 助记类型，必须从以下值中选择：'词根词缀'、'固定搭配'、'近反义词'、'派生'、'词源'、'辨析'、'语法'、'联想'、'谐音'、'串记'、'口诀'、'扩展'、'合成'、'其他'
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
- `noteType: NoteType` - 助记类型，必须从以下值中选择：'词根词缀'、'固定搭配'、'近反义词'、'派生'、'词源'、'辨析'、'语法'、'联想'、'谐音'、'串记'、'口诀'、'扩展'、'合成'、'其他'
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

#### 云词本 `content` 字段解析说明

云词本的 `content` 字段在创建 (`client.notepads.create`) 和更新 (`client.notepads.update`) 时，其内容会经过特定的解析逻辑，以提取单词和短语。理解这些解析规则有助于您更有效地管理词本内容。解析模式如下：

##### 1. 章节模式

当 `content` 中的某一行以 `#` (井号) 字符开头时，该行被视为一个新章节的开始，其后的文本为章节标题。

- **触发方式**：整个 `content` 字符串以 `#` 开始。
- **解析行为**：
  - `#` 后面的文本即为章节的名称，`#`字符后不需要加空格，所添加的空格会被视为章节标题的一部分。
  - 在章节内容中，每行代表一个词条（单词或短语）。
  - 一行中的短语（如 "carry with"）会被视为单个词条，不会被拆分成单独的单词。
  - 单词和短语的提取保留原始输入的大小写形式。系统在处理时可能不区分首字母大小写，但录入时的大小写状态会被记录。
- **示例**：

  输入 `content`:

  ```text
  #自定义章节名1
  mother
  china
  carry with
  #自定义章节名2
  mother
  China
  watching TV
  ```

  解析后，词本结构如下：

  - 章节：自定义章节名1
    - 词条：mother
    - 词条：china
    - 词条：carry with
  - 章节：自定义章节名2
    - 词条：mother
    - 词条：China
    - 词条：watching TV

##### 2. 默认模式 (提取原型)

当 `content` 的字符串以 `//` (两个斜杠) 开头时，系统在解析时会尝试将识别到的英文单词转换为其词典原型。

- **触发方式**：整个 `content` 字符串以 `//` 开始。
- **解析行为**：
  - 系统会从文本中自动提取单个英文单词以及由空格分隔的短语。
  - 在提取过程中，如果识别出的是可以转换的英文单词（通常是动词、名词复数等），会尝试将其还原为原型。例如，对于包含 "I saw many flying birds." 的内容，若启用了此模式，"saw" 可能会被识别为 "see"，"flying" 为 "fly"，"birds" 为 "bird"。
  - 对于已经是原型、无法转换、非英文内容或明确输入的短语，则按默认模式处理其形态和大小写。
- **示例**：

  假设输入 `content` 为:

  ```text
  //I saw many flying birds.
  china
  carry with
  ```

  解析后提取的单词列表:

  ```text
  i
  see
  many
  fly
  bird
  china
  carry
  with
  ```

  解析后提取的短语列表:

  ```text
  carry with
  ```

##### 3. 默认模式 (直接输入)

如果 `content` 的内容不符合其他特定模式（如并非以 `#` 开头，或整个内容并非以 `//` 开头），则会按默认模式进行解析。

- **触发方式**：直接输入英文文本、单词或短语列表，不使用特殊模式标记。
- **解析行为**：
  - 系统会从文本中自动提取单个英文单词以及由空格分隔的短语。
  - 提取时会保留单词和短语的原始输入形态（包括大小写）。例如，`china` 和 `China` 会被视为两个独立的录入项。
- **示例**：

  输入 `content`:

  ```text
  I saw many flying birds.
  china
  carry with
  ```

  解析后提取的单词列表:

  ```text
  I
  saw
  many
  flying
  birds
  china
  carry
  with
  ```

  解析后提取的短语列表:

  ```text
  carry with
  ```

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
  content: '云词本内容',
  brief: '云词本简介',
  tags: ['小学', '四级'],
  status: NotepadStatus.PUBLISHED,
});
```

**参数:**

- `title: string` - 云词本标题
- `content: string` - 云词本内容
- `brief: string` - 云词本简介
- `tags: NotepadTag[]` - 标签，必须从以下值中选择：'小学'、'初中'、'高中'、'大学教科书'、'四级'、'六级'、'专四'、'专八'、'考研'、'新概念'、'SAT'、'托福'、'雅思'、'GRE'、'GMAT'、'托业'、'BEC'、'词典'、'词频'、'其他'
- `status?: NotepadStatus` - 状态，可选

**返回:**

- `Promise<Notepad>` - 创建的云词本对象

**示例:**

```typescript
// 创建云词本
const newNotepad = await client.notepads.create({
  title: '常用词汇',
  content: 'apple\nbanana\norange',
  brief: '常用水果单词',
  tags: ['小学', '四级'],
  status: NotepadStatus.PUBLISHED,
});
```

#### 更新云词本

```typescript
const updatedNotepad = await client.notepads.update('云词本ID', {
  title: '新标题',
  content: '新内容',
  brief: '新简介',
  tags: ['小学', '四级', '词频'],
  status: NotepadStatus.PUBLISHED,
});
```

**参数:**

- `id: string` - 云词本ID
- `title: string` - 云词本标题
- `content: string` - 云词本内容
- `brief: string` - 云词本简介
- `tags: NotepadTag[]` - 标签，必须从以下值中选择：'小学'、'初中'、'高中'、'大学教科书'、'四级'、'六级'、'专四'、'专八'、'考研'、'新概念'、'SAT'、'托福'、'雅思'、'GRE'、'GMAT'、'托业'、'BEC'、'词典'、'词频'、'其他'
- `status?: NotepadStatus` - 状态，可选

**返回:**

- `Promise<Notepad>` - 更新后的云词本对象

**示例:**

```typescript
// 更新云词本
const updatedNotepad = await client.notepads.update('notepad-id-123', {
  title: '常用词汇（更新）',
  content: 'apple\nbanana\norange\npear',
  brief: '常用水果单词（更新）',
  tags: ['小学', '词频'],
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
- `interpretation: string` - 例句翻译
- `tags: PhraseTag[]` - 标签，必须从以下值中选择：'小学'、'初中'、'高中'、'四级'、'六级'、'专升本'、'专四'、'专八'、'考研'、'考博'、'新概念'、'SAT'、'托福'、'雅思'、'GRE'、'GMAT'、'托业'、'BEC'、'词典'、'MBA'、'ACT'、'法学'、'医学'、'短语'
- `origin: string` - 例句来源

**返回:**

- `Promise<Phrase>` - 创建的例句对象

**示例:**

```typescript
// 为单词创建例句
const phrase = await client.phrases.create({
  vocId: '5a7BFf4F63612e5AD9fdebB7a50D3881',
  phrase: 'This is an apple.',
  interpretation: '这是一个苹果。',
  tags: ['小学', '短语'],
  origin: '自定义',
});
```

#### 更新例句

```typescript
const updatedPhrase = await client.phrases.update('例句ID', {
  phrase: '新例句内容',
  interpretation: '新例句翻译',
  tags: ['小学', '四级'],
  origin: '新例句来源',
});
```

**参数:**

- `id: string` - 例句ID
- `phrase: string` - 例句内容
- `interpretation: string` - 例句翻译
- `tags: PhraseTag[]` - 标签，必须从以下值中选择：'小学'、'初中'、'高中'、'四级'、'六级'、'专升本'、'专四'、'专八'、'考研'、'考博'、'新概念'、'SAT'、'托福'、'雅思'、'GRE'、'GMAT'、'托业'、'BEC'、'词典'、'MBA'、'ACT'、'法学'、'医学'、'短语'
- `origin: string` - 例句来源

**返回:**

- `Promise<Phrase>` - 更新后的例句对象

**示例:**

```typescript
// 更新例句
const updatedPhrase = await client.phrases.update('phrase-id-123', {
  phrase: 'This is a red apple.',
  interpretation: '这是一个红苹果。',
  tags: ['小学', '四级', '短语'],
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
