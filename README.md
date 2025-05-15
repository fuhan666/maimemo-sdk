# 墨墨背单词 SDK

墨墨背单词 API 的非官方 Node.js SDK，支持所有[墨墨开放API](https://open.maimemo.com/#/)功能。

## 安装

```bash
npm install maimemo
```

## 使用方法

```typescript
import { Maimemo } from 'maimemo';

// 初始化客户端
const client = new Maimemo('your-token');

// 查询单词
async function queryVocabulary() {
  try {
    const vocabulary = await client.vocabulary.query('apple');
    console.log(vocabulary);
  } catch (error) {
    console.error('Error:', error);
  }
}

queryVocabulary();
```

## API文档

本SDK按照墨墨开放API的功能分组进行设计：

- `interpretations` - 释义相关API
- `notes` - 助记相关API
- `notepads` - 云词本相关API
- `phrases` - 例句相关API
- `vocabulary` - 单词相关API

每个模块提供对应的CRUD操作，详细API文档请参见[完整文档](./docs/API.md)。

## 版本号说明

遵循[语义化版本](https://semver.org/lang/zh-CN/)规范，并采用 `a.bc.d` 的特定格式以对应墨墨官方 API 版本 `a.b.c`：

- `a`: 对应官方 API 版本 (`a.b.c`) 中的 `a`。
- `bc`: 将官方 API 版本 (`a.b.c`) 中的 `b` 和 `c` 组合而成（例如，若官方 API 为 `1.2.3`，则 `bc` 为 `23`）。
- `d`: 本 SDK 的修订号，从 `0` 开始。此号在 SDK 每次进行功能更新或缺陷修复时递增。

## 与官方文档不一致之处

在使用本 SDK 时，请注意以下几点与墨墨开放API官方文档描述不一致的地方：

- **删除操作的返回值**：
  - 删除释义接口`interpretations.delete()`: 官方文档未标明返回值，根据实际测试结果，该接口会返回操作成功与否的布尔值以及错误信息。
  - 删除助记接口`notes.delete()`: 官方文档未标明返回值，根据实际测试结果，该接口会返回操作成功与否的布尔值以及错误信息。
  - 删除例句接口`phrases.delete()`: 官方文档描述会返回被删除例句的完整信息，根据实际测试结果，返回值中并未包含被删除的例句信息，仅返回操作成功与否的布尔值以及错误信息。
  - 删除云词本接口`notepads.delete()`: 官方文档描述会返回被删除云词本的完整信息，根据实际测试结果，返回值中并未包含被删除的云词本信息，仅返回操作成功与否的布尔值以及错误信息。

所有删除接口均不会返回包含详细信息的对象，而是返回操作成功与否的布尔值以及错误信息。

## 开源协议

MIT
