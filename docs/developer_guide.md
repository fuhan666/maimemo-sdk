# 墨墨背单词 SDK 开发者指南

## 目录

1. [项目概述](#项目概述)
2. [代码结构](#代码结构)
3. [架构设计](#架构设计)
4. [API实现详情](#api实现详情)
   - [客户端实现](#客户端实现)
   - [单词API实现](#单词api实现)
   - [释义API实现](#释义api实现)
   - [助记API实现](#助记api实现)
   - [云词本API实现](#云词本api实现)
   - [例句API实现](#例句api实现)
5. [错误处理机制](#错误处理机制)
6. [测试策略](#测试策略)
7. [开发实践](#开发实践)
8. [发布流程](#发布流程)

## 项目概述

墨墨背单词 SDK 是一个 Node.js 客户端库，用于与墨墨背单词 API 进行交互。该 SDK 采用 TypeScript 开发，提供类型安全的 API 调用体验，同时实现了完整的错误处理机制和重试逻辑。

### 项目目标

- 提供完整的 API 覆盖
- 类型安全（TypeScript）
- 友好的错误处理机制
- 良好的文档和示例
- 符合现代 JavaScript 最佳实践

### 开发进度概览

| 模块       | 状态 | 完成度 | 备注                           |
| ---------- | ---- | ------ | ------------------------------ |
| 项目结构   | 完成 | 100%   | 包括目录结构、配置文件等       |
| 基础客户端 | 完成 | 100%   | 包括请求处理、认证逻辑等       |
| 错误处理   | 完成 | 100%   | 包括错误类定义、错误转换等     |
| 单词 API   | 完成 | 100%   | 查询单词功能                   |
| 释义 API   | 完成 | 100%   | 包括查询、创建、更新、删除功能 |
| 助记 API   | 完成 | 100%   | 包括查询、创建、更新、删除功能 |
| 云词本 API | 完成 | 100%   | 包括查询、创建、更新、删除功能 |
| 例句 API   | 完成 | 100%   | 包括查询、创建、更新、删除功能 |
| 单元测试   | 完成 | 100%   | 涵盖基础服务类、各API模块      |
| 集成测试   | 完成 | 100%   | 包括API完整流程测试            |
| 文档       | 完成 | 100%   | 已完成API文档、示例代码        |
| CI/CD      | 完成 | 100%   | 已设置GitHub Actions           |

## 代码结构

```
maimemo-sdk-node/
├── src/                     # 源代码目录
│   ├── index.ts             # 主入口文件
│   ├── errors.ts            # 错误处理
│   ├── client.ts            # 主客户端类
│   ├── utils/               # 工具函数
│   │   ├── request.ts       # 请求工具
│   │   └── helpers.ts       # 辅助函数
│   ├── services/            # API 服务类
│   │   ├── base-service.ts  # 基础服务类
│   │   ├── vocabulary.ts    # 单词服务
│   │   ├── interpretation.ts# 释义服务
│   │   ├── note.ts          # 助记服务
│   │   ├── notepad.ts       # 云词本服务
│   │   └── phrase.ts        # 例句服务
│   └── types/               # 类型定义
│       ├── index.ts
│       ├── common.ts        # 通用类型
│       ├── vocabulary.ts    # 单词相关类型
│       ├── interpretation.ts# 释义相关类型
│       ├── note.ts          # 助记相关类型
│       ├── notepad.ts       # 云词本相关类型
│       └── phrase.ts        # 例句相关类型
├── examples/                # 示例代码
│   └── basic-usage.ts       # 基本使用示例
├── tests/                   # 测试目录
│   ├── unit/               # 单元测试
│   └── integration/        # 集成测试
├── docs/                	# 文档
│   ├── developer_guide.md   # 开发者指南
│   └── user_guide.md        # 用户指南
├── dist/                    # 编译后的代码
├── .eslintrc.js            # ESLint 配置
├── .prettierrc             # Prettier 配置
├── tsconfig.json           # TypeScript 配置
├── package.json            # 项目配置
└── README.md               # 项目说明
```

### 关键文件说明

- **index.ts**: 导出所有公共API，是用户使用SDK的入口点
- **client.ts**: 主客户端类，负责初始化和管理各服务实例
- **errors.ts**: 定义SDK的错误类型和错误处理逻辑
- **services/base-service.ts**: 基础服务类，包含通用的请求处理逻辑
- **services/\*.ts**: 各API资源的服务实现
- **types/\*.ts**: 定义SDK中使用的类型，包括请求参数、响应结构等

## 架构设计

### 整体架构

SDK采用分层架构设计：

1. **客户端层 (Client Layer)**

   - `Maimemo` 类：统一入口点，管理全局配置和服务实例
   - 负责初始化各服务并提供访问接口

2. **服务层 (Service Layer)**

   - 各资源服务类：每种API资源对应一个服务类
   - 继承自 `BaseService`，实现具体API调用逻辑

3. **网络层 (Network Layer)**

   - 基于Axios的HTTP客户端
   - 请求拦截器：添加认证信息、设置通用头部
   - 响应拦截器：处理错误、转换响应格式

4. **错误处理层 (Error Handling Layer)**
   - 自定义错误类：将API错误转换为友好的错误对象
   - 错误转换逻辑：根据HTTP状态码和响应内容确定错误类型

### 依赖注入

SDK使用简单的依赖注入模式：

- `Maimemo` 类创建并持有HTTP客户端实例
- 服务类在初始化时接收HTTP客户端实例
- 使得测试时可以注入模拟的HTTP客户端

### 类型系统

SDK利用TypeScript的类型系统：

- 对外暴露的所有方法均有完整类型定义
- 请求参数有明确的接口定义
- 响应数据有明确的类型定义
- 提高开发体验和安全性

## API实现详情

### 客户端实现

`Maimemo` 类是SDK的主入口点，负责初始化配置和创建服务实例。

```typescript
class Maimemo {
  public readonly vocabulary: VocabularyService;
  public readonly interpretations: InterpretationService;
  public readonly notes: NoteService;
  public readonly notepads: NotepadService;
  public readonly phrases: PhraseService;

  constructor(token: string, options?: MaimemoOptions) {
    // 验证token
    if (!token) {
      throw new ValidationError('API token is required');
    }

    // 合并默认配置
    const defaultOptions: MaimemoOptions = {
      baseUrl: 'https://open.maimemo.com/open',
    };

    const config = { ...defaultOptions, ...options };

    // 创建axios实例
    const axiosInstance = axios.create({
      baseURL: config.baseUrl,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        ...config.headers,
      },
    });

    // 初始化服务
    this.vocabulary = new VocabularyService(axiosInstance);
    this.interpretations = new InterpretationService(axiosInstance);
    this.notes = new NoteService(axiosInstance);
    this.notepads = new NotepadService(axiosInstance);
    this.phrases = new PhraseService(axiosInstance);
  }
}
```

### 基础服务类实现

所有API服务类都继承自 `BaseService` 类，它提供了处理请求和响应的通用方法。

```typescript
abstract class BaseService {
  protected http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  protected async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.http.request(config);
      return this.parseResponse<T>(response.data);
    } catch (error) {
      // 错误已由拦截器处理，这里主要是类型转换
      throw error;
    }
  }

  protected parseResponse<T>(data: any): T {
    // 根据API的通用响应格式提取数据
    if (data && typeof data === 'object') {
      // 检查是否为成功响应
      if (data.code === 0) {
        // 确定真正的数据字段名
        const dataFieldKeys = Object.keys(data).filter(
          (key) => key !== 'code' && key !== 'message',
        );

        if (dataFieldKeys.length === 1) {
          return data[dataFieldKeys[0]] as T;
        }
        // 某些没有数据的成功响应直接返回空对象
        return {} as T;
      }
      // 失败响应会由拦截器处理，理论上不会到这里
      throw new APIError(`Unexpected response format: ${JSON.stringify(data)}`);
    }
    throw new APIError(`Invalid response data: ${data}`);
  }
}
```

### 单词API实现

```typescript
class VocabularyService extends BaseService {
  // 查询单词
  async query(spelling: string): Promise<Vocabulary> {
    if (!spelling) {
      throw new ValidationError('Spelling is required');
    }

    return this.request<Vocabulary>({
      method: 'GET',
      url: '/api/v1/vocabulary',
      params: { spelling },
    });
  }
}
```

### 释义API实现

```typescript
class InterpretationService extends BaseService {
  // 获取释义列表
  async list(vocId: string): Promise<Interpretation[]> {
    if (!vocId) {
      throw new ValidationError('Vocabulary ID is required');
    }

    return this.request<Interpretation[]>({
      method: 'GET',
      url: '/api/v1/interpretations',
      params: { voc_id: vocId },
    });
  }

  // 创建释义
  async create(params: CreateInterpretationParams): Promise<Interpretation> {
    if (!params.vocId) {
      throw new ValidationError('Vocabulary ID is required');
    }
    if (!params.interpretation) {
      throw new ValidationError('Interpretation content is required');
    }

    return this.request<Interpretation>({
      method: 'POST',
      url: '/api/v1/interpretations',
      data: {
        interpretation: {
          voc_id: params.vocId,
          interpretation: params.interpretation,
          tags: params.tags || [],
          status: params.status || InterpretationStatus.PUBLISHED,
        },
      },
    });
  }

  // 更新释义
  async update(
    id: string,
    params: UpdateInterpretationParams,
  ): Promise<Interpretation> {
    if (!id) {
      throw new ValidationError('Interpretation ID is required');
    }
    if (!params.interpretation) {
      throw new ValidationError('Interpretation content is required');
    }

    return this.request<Interpretation>({
      method: 'POST',
      url: `/api/v1/interpretations/${id}`,
      data: {
        interpretation: {
          interpretation: params.interpretation,
          tags: params.tags || [],
          status: params.status || InterpretationStatus.PUBLISHED,
        },
      },
    });
  }

  // 删除释义
  async delete(id: string): Promise<void> {
    if (!id) {
      throw new ValidationError('Interpretation ID is required');
    }

    await this.request<void>({
      method: 'DELETE',
      url: `/api/v1/interpretations/${id}`,
    });
  }
}
```

其它API服务类的实现类似，这里不再详述。

### 类型定义

SDK定义了完整的类型系统，包括：

#### 通用类型

```typescript
// SDK配置选项
interface MaimemoOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
}

// API通用响应
interface APIResponse<T> {
  code: number;
  message: string;
  [dataField: string]: T | number | string;
}

// 分页参数
interface PaginationParams {
  limit: number;
  offset: number;
}
```

#### 资源类型

```typescript
// 单词
interface Vocabulary {
  id: string;
  spelling: string;
}

// 释义状态枚举
enum InterpretationStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

// 释义
interface Interpretation {
  id: string;
  interpretation: string;
  tags: string[];
  status: InterpretationStatus;
  created_time: string;
  updated_time: string;
}

// 助记
interface Note {
  id: string;
  noteType: string;
  note: string;
  created_time: string;
  updated_time: string;
}

// 简要云词本
interface BriefNotepad {
  id: string;
  title: string;
  description: string;
  tags: string[];
  word_count: number;
  created_time: string;
  updated_time: string;
}

// 完整云词本
interface Notepad extends BriefNotepad {
  words: string[];
}

// 例句
interface Phrase {
  id: string;
  phrase: string;
  translation: string;
  tags: string[];
  source: string;
  created_time: string;
  updated_time: string;
}
```

#### 参数类型

```typescript
// 创建释义参数
interface CreateInterpretationParams {
  vocId: string;
  interpretation: string;
  tags?: string[];
  status?: InterpretationStatus;
}

// 更新释义参数
interface UpdateInterpretationParams {
  interpretation: string;
  tags?: string[];
  status?: InterpretationStatus;
}

// 更多参数类型定义...
```

## 错误处理机制

错误处理是SDK的核心功能之一，我们定义了一系列自定义错误类型：

```typescript
// 基础错误类
class MaimemoError extends Error {
  readonly statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;

    // 修复继承链
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// 验证错误
class ValidationError extends MaimemoError {
  constructor(message: string) {
    super(message, 400);
  }
}

// 认证错误
class AuthenticationError extends MaimemoError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
  }
}

// 资源未找到错误
class NotFoundError extends MaimemoError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

// API错误
class APIError extends MaimemoError {
  constructor(message: string, statusCode: number = 500) {
    super(message, statusCode);
  }
}

// 网络错误
class NetworkError extends MaimemoError {
  constructor(message: string = 'Network error') {
    super(message);
  }
}
```

### 错误转换逻辑

在响应拦截器中，根据HTTP状态码和响应内容将错误转换为对应的自定义错误类型：

```typescript
private convertError(error: AxiosError): MaimemoError {
  // 检查响应
  if (error.response) {
    const { status, data } = error.response;
    let message = 'API request failed';

    // 尝试从响应提取错误信息
    if (data && typeof data === 'object' && data.message) {
      message = data.message;
    }

    // 根据状态码选择错误类型
    switch (status) {
      case 400:
        return new ValidationError(message);
      case 401:
        return new AuthenticationError(message);
      case 404:
        return new NotFoundError(message);
      default:
        return new APIError(message, status);
    }
  }

  // 网络错误
  if (error.request) {
    return new NetworkError('Network error: No response received');
  }

  // 其他错误
  return new MaimemoError(error.message || 'Unknown error');
}
```

## 开发实践

### 开发工作流

1. **分支管理**：

   - `main`：稳定版分支，只接受来自 `develop` 的合并
   - `develop`：开发分支，所有功能分支合并到此
   - `feature/*`：功能分支，用于开发新功能
   - `bugfix/*`：修复分支，用于修复错误
   - `release/*`：发布准备分支

2. **提交规范**：使用 Conventional Commits 规范：

   - `feat`：新功能
   - `fix`：错误修复
   - `docs`：文档更改
   - `style`：代码风格更改
   - `refactor`：代码重构
   - `test`：测试相关
   - `chore`：构建过程或辅助工具的变动

3. **代码审查**：
   - 所有代码提交必须通过代码审查
   - 使用 GitHub Pull Request 进行代码审查
   - 至少一名其他开发者的批准才能合并

### 持续集成

使用 GitHub Actions 进行持续集成：

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'
      - name: Install dependencies
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Test
        run: npm test
      - name: Build
        run: npm run build
      - name: Upload coverage
        uses: codecov/codecov-action@v1
```

## 发布流程

### 版本管理

使用语义化版本控制 (Semantic Versioning)：

- **主版本号**：当你做了不兼容的 API 修改
- **次版本号**：当你做了向下兼容的功能性新增
- **修订号**：当你做了向下兼容的问题修正

### 发布步骤

1. **准备发布**：

   - 从 `develop` 创建 `release/x.y.z` 分支
   - 更新版本号和 CHANGELOG.md
   - 进行最终测试和修复

2. **发布**：

   - 将 `release/x.y.z` 合并到 `main`
   - 在 `main` 上创建版本标签
   - 发布到 npm

3. **发布后**：
   - 将 `main` 合并回 `develop`
   - 关闭相关 GitHub issues

### npm 发布配置

```json
// package.json
{
  "name": "maimemo-sdk",
  "version": "1.0.0",
  "description": "Node.js client for 墨墨背单词 API",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist", "README.md", "LICENSE"],
  "scripts": {
    "build": "tsc",
    "prepublishOnly": "npm run build"
  }
}
```
