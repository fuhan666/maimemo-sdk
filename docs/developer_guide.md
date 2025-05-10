# 墨墨背单词 SDK 开发者指南

## 目录

- [墨墨背单词 SDK 开发者指南](#墨墨背单词-sdk-开发者指南)
  - [目录](#目录)
  - [项目概述](#项目概述)
  - [代码结构](#代码结构)
  - [架构设计](#架构设计)
    - [整体架构](#整体架构)
    - [依赖注入](#依赖注入)

## 项目概述

墨墨背单词 SDK 是一个 Node.js 客户端库，用于与墨墨背单词 API 进行交互。该 SDK 采用 TypeScript 开发，提供类型安全的 API 调用体验。

## 代码结构

```
maimemo-sdk/
├── src/                        # 源代码目录
│   ├── index.ts                # 主入口文件
│   ├── errors.ts               # 错误处理
│   ├── client.ts               # 主客户端类
│   ├── resources/              # API 服务类
│   │   ├── index.ts            # 主入口文件
│   │   ├── base.ts             # 基础服务类
│   │   ├── vocabulary.ts       # 单词服务
│   │   ├── interpretations.ts  # 释义服务
│   │   ├── notes.ts            # 助记服务
│   │   ├── notepads.ts         # 云词本服务
│   │   └── phrases.ts          # 例句服务
│   └── types/                  # 类型定义
│       └── index.ts            # 类型定义
├── docs/                	      # 文档
│   ├── developer_guide.md      # 开发者指南
│   └── user_guide.md           # 用户指南
├── eslint.config.mjs           # ESLint 配置
├── .prettierrc                 # Prettier 配置
├── tsconfig.json               # TypeScript 配置
├── package.json                # 项目配置
└── README.md                   # 项目说明
```

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
