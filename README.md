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

// 获取单词
async function queryVocabulary() {
  try {
    const vocabulary = await client.vocabulary.get('apple');
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
- `study` - 学习数据相关API（公测）

每个模块提供对应的CRUD操作，详细API文档请参见[完整文档](./docs/API.md)。

### 单词接口兼容性

- 推荐使用 `client.vocabulary.get(spelling)` 获取单个单词。
- 旧版本的 `client.vocabulary.query(spelling)` 会继续保留，行为与 `get(spelling)` 一致，但新代码建议迁移到 `get`。
- 批量查询请使用 `client.vocabulary.list({ spellings })` 或 `client.vocabulary.list({ ids })`。

### 学习数据接口说明

`client.study.*` 对应官方“学习数据（公测）”接口。公测期间官方不保证可用性，接口可能调整，并且需要在 App 中开启自动同步。

### 官方请求频率限制

最新官方文档说明的请求频率限制为：10 秒内 20 次、60 秒内 40 次、5 小时内 2000 次。

## 版本号说明

遵循[语义化版本](https://semver.org/lang/zh-CN/)规范，并采用 `a.bc.d` 的特定格式以对应墨墨官方 API 版本 `a.b.c`：

- `a`: 对应官方 API 版本 (`a.b.c`) 中的 `a`。
- `bc`: 将官方 API 版本 (`a.b.c`) 中的 `b` 和 `c` 组合而成（例如，若官方 API 为 `1.2.3`，则 `bc` 为 `23`）。
- `d`: 本 SDK 的修订号，从 `0` 开始。此号在 SDK 每次进行功能更新或缺陷修复时递增。

## 官方文档与实测差异

本 SDK 以墨墨开放 API 官方文档为基准实现，但部分接口的实际返回与官方文档存在差异。SDK 会优先兼容真实 API 行为，并在返回值和类型定义上提供稳定封装。

例如，部分删除接口实测并不会返回被删除对象，SDK 因此统一将删除方法封装为 `boolean` 返回值。

完整差异说明请参见 [API 文档中的官方文档与实测差异说明](./docs/API.md#官方文档与实测差异说明)。

## 开源协议

MIT
