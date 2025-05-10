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

每个模块提供对应的CRUD操作，详细API文档请参见[完整文档](./docs/user_guide.md)。

## 开源协议

MIT 