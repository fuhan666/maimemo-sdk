# 墨墨背单词 SDK 用户指南

## 目录

- [墨墨背单词 SDK 用户指南](#墨墨背单词-sdk-用户指南)
  - [目录](#目录)
  - [简介](#简介)
  - [安装](#安装)
  - [基本用法](#基本用法)
  - [API参考](#api参考)
    - [官方文档与实测差异说明](#官方文档与实测差异说明)
    - [初始化客户端](#初始化客户端)
    - [单词API](#单词api)
      - [获取单词](#获取单词)
      - [查询单词（兼容旧 API）](#查询单词兼容旧-api)
      - [批量查询单词](#批量查询单词)
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
      - [云词本 `content` 字段解析说明](#云词本-content-字段解析说明)
        - [1. 章节模式](#1-章节模式)
        - [2. 默认模式 (提取原型)](#2-默认模式-提取原型)
        - [3. 默认模式 (直接输入)](#3-默认模式-直接输入)
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
    - [学习数据（公测）API](#学习数据公测api)
      - [获取今日学习进度](#获取今日学习进度)
      - [获取今日学习单词](#获取今日学习单词)
      - [查询学习记录](#查询学习记录)
      - [添加单词到学习计划](#添加单词到学习计划)
      - [提前复习](#提前复习)
    - [请求频率限制](#请求频率限制)
  - [错误处理](#错误处理)
    - [错误类型](#错误类型)
    - [通用错误码](#通用错误码)
    - [错误处理示例](#错误处理示例)

## 简介

墨墨背单词 SDK 是一个Node.js客户端库，用于与墨墨背单词API进行交互。通过这个SDK，你可以轻松地在自己的应用程序中集成墨墨背单词的功能。

## 安装

使用npm安装：

```bash
npm install maimemo
```

或使用yarn安装：

```bash
yarn add maimemo
```

## 基本用法

以下是使用SDK的基本示例：

```typescript
import { Maimemo } from 'maimemo';

// 初始化客户端
const client = new Maimemo('your-token-here');

// 获取单词
async function getWordDetails() {
  try {
    // 获取单词ID
    const vocabulary = await client.vocabulary.get('apple');
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

更多用法和示例代码，请参考 [examples](https://github.com/fuhan666/maimemo-sdk/tree/main/examples) 目录。

## API参考

### 官方文档与实测差异说明

SDK 以 `docs/official/new-official.yaml` 为基准实现；以下为真实 API 验证中发现的已知差异，SDK 会尽量以兼容真实返回为优先：

- **创建/更新接口状态码**：释义、助记、云词本、例句的创建/更新接口，官方文档多标注为 `200`，实测成功时可能返回 `201`。SDK 使用 Axios 默认 2xx 成功判定，因此会按正常成功响应处理。
- **删除接口返回体**：部分删除接口官方文档描述会返回被删除对象，实测可能只返回 `errors` 与 `success`。SDK 对删除方法统一返回 `boolean`。
- **云词本详情结构**：云词本详情中的 `list` 实测为扁平结构，例如 `{ type: 'CHAPTER', chapter: '...' }` 或 `{ type: 'WORD', chapter: '...', word: '...' }`，不是嵌套在 `data` 字段下的结构。
- **云词本简化返回**：云词本创建/更新接口实测可能不返回 `creator`、`content`、`list` 字段；SDK 因此将这些字段标记为可选。
- **云词本 `ids` 查询参数**：官方文档标注列表接口支持按 `ids` 过滤；补充测试后确认常见 GET 数组序列化均不可用：`ids=<id>` 返回 `ids must be an array`，`ids[]=<id>` 与 `ids[0]=<id>` 返回 `common_internal_error`。当前不建议依赖该参数，查询单个云词本请使用 `client.notepads.get(id)`。
- **例句 `highlight` 字段**：例句创建/更新接口实测返回体可能不包含 `highlight`；SDK 因此将该字段标记为可选。
- **学习数据（公测）接口**：学习接口与账号状态强相关。若账号未开启自动同步、当日未打开 App 初始化或学习数据状态不满足要求，实测可能返回 `study_data_not_found`、`common_internal_error` 等错误。

### 初始化客户端

**参数:**

- `token: string` - API认证令牌
- `options?: MaimemoOptions` - 可选的SDK配置
  - `env?: 'production' | 'development'` - API环境，可选值：'production' (默认) 或 'development'。
    - `'production'` 指向 `https://open.maimemo.com/open`
    - `'development'` 指向 `https://open-dev.maimemo.com/open`
  - `axiosConfig?: AxiosRequestConfig` - 可选的 Axios 配置对象，用于自定义底层的 HTTP 客户端行为。例如超时时间、自定义头部、代理等

**示例:**

```typescript
// 示例：默认配置
import { Maimemo } from 'maimemo';
const client = new Maimemo('your-token');

// 示例：自定义 Axios 配置
import { AxiosRequestConfig } from 'axios';
const axiosConfig: AxiosRequestConfig = {
  timeout: 10000,
  headers: {
    'X-Custom-Header': 'MyValue'
  }
};
const clientWithCustomConfig = new Maimemo('your-token', {
  env: 'development',
  axiosConfig
});
```

### 单词API

#### 获取单词

推荐使用 `client.vocabulary.get(spelling)` 获取单个单词。该方法对应官方 `GET /api/v1/vocabulary` 接口。

**参数:**

- `spelling: string` - 单词拼写

**返回:**

- `Promise<Vocabulary>` - 包含单词ID和拼写的对象

**示例:**

```typescript
// 根据拼写获取单词
const vocabulary = await client.vocabulary.get('apple');
console.log(vocabulary);
// 输出: { id: 'voc-IfjIcasJ9PrA5XWrvmnrgceiI1hTC45HqtwLUaZfTNhBsfYvtR5nL4tr3DLB8P-m', spelling: 'apple' }
```

#### 查询单词（兼容旧 API）

`client.vocabulary.query(spelling)` 是旧版本 SDK 已公开的方法，会继续保留以兼容现有用户。它的行为与 `get(spelling)` 完全一致，但新代码建议迁移到 `get(spelling)`。

**参数:**

- `spelling: string` - 单词拼写

**返回:**

- `Promise<Vocabulary>` - 包含单词ID和拼写的对象

**示例:**

```typescript
// 兼容旧代码：行为与 client.vocabulary.get('apple') 一致
const vocabulary = await client.vocabulary.query('apple');
```

#### 批量查询单词

使用 `client.vocabulary.list(params)` 按拼写或单词 ID 批量查询单词。该方法对应官方 `POST /api/v1/vocabulary/query` 接口。

**参数:**

- `params: ListVocabularyParams` - 批量查询参数
  - `spellings: string[]` - 单词拼写列表，最多 1000 个
  - 或 `ids: string[]` - 单词 ID 列表，最多 1000 个

`spellings` 与 `ids` 为互斥条件，请一次只传其中一种。

**返回:**

- `Promise<Vocabulary[]>` - 单词对象数组

**示例:**

```typescript
// 按拼写批量查询
const vocabulariesBySpelling = await client.vocabulary.list({
  spellings: ['apple', 'banana'],
});

// 按单词 ID 批量查询
const vocabulariesById = await client.vocabulary.list({
  ids: ['voc-IfjIcasJ9PrA5XWrvmnrgceiI1hTC45HqtwLUaZfTNhBsfYvtR5nL4tr3DLB8P-m'],
});
```

### 释义API

#### 获取释义列表

**参数:**

- `vocId: string` - 单词ID

**返回:**

- `Promise<Interpretation[]>` - 释义对象数组

**示例:**

```typescript
// 获取单词的释义列表
const interpretations = await client.interpretations.list(
  'voc-IfjIcasJ9PrA5XWrvmnrgceiI1hTC45HqtwLUaZfTNhBsfYvtR5nL4tr3DLB8P-m'
);
```

#### 创建释义

**参数:**

- `vocId: string` - 单词ID
- `interpretation: string` - 释义内容
- `tags: InterpretationTag[]` - 标签，必须从以下值中选择：'考研'、'简明'、'详细'、'英英'、'小学'、'初中'、'高中'、'四级'、'六级'、'专升本'、'专四'、'专八'、'考博'、'雅思'、'托福'、'托业'、'新概念'、'GRE'、'GMAT'、'BEC'、'MBA'、'SAT'、'ACT'、'法学'、'医学'
- `status: InterpretationStatus` - 状态，PUBLISHED, UNPUBLISHED, DELETED

**返回:**

- `Promise<Interpretation>` - 创建的释义对象

**示例:**

```typescript
// 为单词创建释义
const interpretation = await client.interpretations.create({
  vocId: 'voc-IfjIcasJ9PrA5XWrvmnrgceiI1hTC45HqtwLUaZfTNhBsfYvtR5nL4tr3DLB8P-m',
  interpretation: 'n. 苹果',
  tags: ['考研'],
  status: InterpretationStatus.PUBLISHED,
});
```

#### 更新释义

**参数:**

- `id: string` - 释义ID
- `interpretation: string` - 释义内容
- `tags: InterpretationTag[]` - 标签，必须从以下值中选择：'考研'、'简明'、'详细'、'英英'、'小学'、'初中'、'高中'、'四级'、'六级'、'专升本'、'专四'、'专八'、'考博'、'雅思'、'托福'、'托业'、'新概念'、'GRE'、'GMAT'、'BEC'、'MBA'、'SAT'、'ACT'、'法学'、'医学'
- `status: InterpretationStatus` - 状态，PUBLISHED, UNPUBLISHED, DELETED

**返回:**

- `Promise<Interpretation>` - 更新后的释义对象

**示例:**

```typescript
// 更新释义
const updatedInterpretation = await client.interpretations.update(
  '8f7e6d5c4b3a2190',
  {
    interpretation: 'n. 苹果',
    tags: ['考研', '四级'],
    status: InterpretationStatus.PUBLISHED,
  }
);
```

#### 删除释义

**参数:**

- `id: string` - 释义ID

**返回:**

- `Promise<boolean>` - 删除结果

**示例:**

```typescript
// 删除释义
await client.interpretations.delete('8f7e6d5c4b3a2190');
```

### 助记API

#### 获取助记列表

**参数:**

- `vocId: string` - 单词ID

**返回:**

- `Promise<Note[]>` - 助记对象数组

**示例:**

```typescript
// 获取单词的助记列表
const notes = await client.notes.list('voc-IfjIcasJ9PrA5XWrvmnrgceiI1hTC45HqtwLUaZfTNhBsfYvtR5nL4tr3DLB8P-m');
```

#### 创建助记

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
  vocId: 'voc-IfjIcasJ9PrA5XWrvmnrgceiI1hTC45HqtwLUaZfTNhBsfYvtR5nL4tr3DLB8P-m',
  noteType: '谐音',
  note: '苹果的助记内容',
});
```

#### 更新助记

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

**参数:**

- `id: string` - 助记ID

**返回:**

- `Promise<boolean>` - 删除结果

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

**参数:**

- `limit: number` - 每页数量
- `offset: number` - 偏移量
- `ids?: string[]` - 可选，指定云词本ID列表。**官方接口似乎无法正确处理这个参数，会报错。目前不建议使用该参数来查询**

**返回:**

- `Promise<BriefNotepad[]>` - 简要云词本对象数组

**示例:**

```typescript
// 获取云词本列表
const notepads = await client.notepads.list(10, 0);

// 不推荐：实测官方接口无法稳定处理 ids 数组参数
const specificNotepads = await client.notepads.list(10, 0, ['id1', 'id2']);

// 推荐：查询单个云词本详情
const notepad = await client.notepads.get('id1');
```

#### 获取云词本详情

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

**返回:**

- `Promise<boolean>` - 删除结果

**示例:**

```typescript
// 删除云词本
await client.notepads.delete('notepad-id-123');
```

### 例句API

#### 获取例句列表

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
  vocId: 'voc-IfjIcasJ9PrA5XWrvmnrgceiI1hTC45HqtwLUaZfTNhBsfYvtR5nL4tr3DLB8P-m',
  phrase: 'This is an apple.',
  interpretation: '这是一个苹果。',
  tags: ['小学', '短语'],
  origin: '自定义',
});
```

#### 更新例句

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

**参数:**

- `id: string` - 例句ID

**返回:**

- `Promise<boolean>` - 删除结果

**示例:**

```typescript
// 删除例句
await client.phrases.delete('phrase-id-123');
```

### 学习数据（公测）API

`client.study.*` 对应官方“学习数据（公测）”接口。公测期间官方不保证接口可用性，接口可能调整；使用前请确认账号已在 App 中开启自动同步。部分接口还依赖当日打开 App 完成初始化，详见各接口说明。

#### 获取今日学习进度

**参数:**

无

**返回:**

- `Promise<StudyProgress>` - 今日学习进度
  - `finished: number` - 今日已完成数量
  - `total: number` - 今日总数量
  - `study_time: number` - 今日学习时长，单位为毫秒

如果当日未打开 App 进行初始化，官方接口无法准确计算今日总数量。

**示例:**

```typescript
const progress = await client.study.getStudyProgress();
console.log(progress);
// 输出: { finished: 10, total: 50, study_time: 600 }
```

#### 获取今日学习单词

**参数:**

- `params?: GetTodayItemsParams` - 查询参数
  - `is_finished?: boolean` - 是否已完成
  - `is_new?: boolean` - 是否新词
  - `voc_ids?: string[]` - 单词 ID 列表，最多 1000 个；传入后会忽略其他筛选条件
  - `spellings?: string[]` - 单词拼写列表，最多 1000 个；不可与 `voc_ids` 同时使用
  - `limit?: number` - 返回数量限制，最多 1000，默认 50

如果当日未打开 App 进行初始化，官方接口无法获取今日学习单词。

**返回:**

- `Promise<StudyTodayItem[]>` - 今日学习单词列表

**示例:**

```typescript
const unfinishedItems = await client.study.getTodayItems({
  is_finished: false,
  limit: 20,
});
```

#### 查询学习记录

**参数:**

- `params?: QueryStudyRecordsParams` - 查询参数
  - `next_study_date?: { start?: string; end?: string }` - 下次学习日期范围
  - `voc_ids?: string[]` - 单词 ID 列表；传入后会忽略其他筛选条件
  - `spellings?: string[]` - 单词拼写列表，最多 1000 个；不可与 `voc_ids` 同时使用
  - `as_count?: boolean` - 是否仅计算结果总数；为 `true` 时 `records` 为空，`count` 有效
  - `limit?: number` - 返回数量限制，最多 1000，默认 50

**返回:**

- `Promise<QueryStudyRecordsResult>` - 学习记录和总数
  - `records: StudyRecord[]` - 学习记录列表
  - `count: number` - 记录总数

**示例:**

```typescript
const studyRecords = await client.study.queryStudyRecords({
  spellings: ['apple', 'banana'],
  limit: 20,
});
console.log(studyRecords.records, studyRecords.count);
```

#### 添加单词到学习计划

**参数:**

- `params: AddWordsParams` - 添加参数
  - `words: Array<{ id: string }>` - 要添加的单词 ID 列表，最多 1000 个
  - `advance: boolean` - 是否一并提前复习，无等级限制

**返回:**

- `Promise<number>` - 成功添加的数量

**示例:**

```typescript
const addedCount = await client.study.addWords({
  words: [{ id: 'voc-IfjIcasJ9PrA5XWrvmnrgceiI1hTC45HqtwLUaZfTNhBsfYvtR5nL4tr3DLB8P-m' }],
  advance: false,
});
```

#### 提前复习

**参数:**

- `params: AdvanceStudyParams` - 提前复习参数
  - `voc_ids: string[]` - 要提前复习的单词 ID 列表，最多 1000 个

该接口会将单词提前到当下马上复习，需要账号升级到 10 级后解锁提前复习功能。

**返回:**

- `Promise<number>` - 成功提前复习的数量

**示例:**

```typescript
const advancedCount = await client.study.advanceStudy({
  voc_ids: ['voc-IfjIcasJ9PrA5XWrvmnrgceiI1hTC45HqtwLUaZfTNhBsfYvtR5nL4tr3DLB8P-m'],
});
```

### 请求频率限制

最新官方文档说明的请求频率限制为：

- 10 秒内最多 20 次请求
- 60 秒内最多 40 次请求
- 5 小时内最多 2000 次请求

超过限制时，接口通常会返回 `429`，SDK 会抛出 `APIError`。

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
| 400    | 请求参数错误         | APIError            |
| 401    | 未授权（Token 无效） | AuthenticationError |
| 404    | 资源未找到           | NotFoundError       |
| 429    | 请求频率过高         | APIError            |
| 500    | 服务器内部错误       | APIError            |
| 503    | 服务不可用           | APIError            |

### 错误处理示例

```typescript
try {
  const vocabulary = await client.vocabulary.get('nonexistent');
} catch (error) {
  if (error instanceof NotFoundError) {
    console.error('单词未找到');
  } else if (error instanceof AuthenticationError) {
    console.error('认证失败，请检查令牌');
  } else if (error instanceof ValidationError) {
    console.error('参数错误：', error.message);
  } else if (error instanceof APIError) {
    console.error(
      'API服务器错误：',
      error.message,
      '状态码：',
      error.status
    );
  } else if (error instanceof NetworkError) {
    console.error('网络错误：', error.message);
  } else if (error instanceof TimeoutError) {
    console.error('请求超时：', error.message);
  } else {
    console.error('未知错误：', error);
  }
}
```
