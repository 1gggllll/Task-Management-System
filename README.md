# 任务管理系统 (Task Management System)

一个功能完整的任务管理系统，支持用户注册登录、创建项目、分配任务、跟踪进度。采用前后端分离架构，具备高内聚低耦合的特点。

## 功能特性

### 用户管理
- 用户注册和登录
- JWT身份认证
- 个人资料管理
- 头像上传

### 项目管理
- 创建、编辑、删除项目
- 项目成员管理
- 项目权限控制
- 项目统计

### 任务管理
- 创建、编辑、删除任务
- 任务状态管理（待办、进行中、审核中、已完成）
- 任务优先级设置（低、中、高、紧急）
- 任务分配和截止日期
- 任务筛选和搜索

### 数据可视化
- 仪表盘统计
- 项目进度展示
- 任务状态分布
- 个人工作统计

## 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **状态管理**: Redux Toolkit
- **路由**: React Router v6
- **UI库**: Ant Design 5
- **HTTP客户端**: Axios
- **测试**: Jest + React Testing Library

### 后端
- **运行时**: Node.js 18+
- **框架**: Express.js + TypeScript
- **ORM**: Prisma
- **认证**: JWT (jsonwebtoken)
- **验证**: Joi
- **日志**: Winston
- **测试**: Jest + Supertest

### 数据库
- **主数据库**: PostgreSQL 15
- **缓存**: Redis (可选)

### 开发工具
- **容器化**: Docker + Docker Compose
- **代码规范**: ESLint + Prettier
- **提交规范**: Conventional Commits

## 项目架构

```
task-management-system/
├── client/                     # 前端应用
│   ├── src/
│   │   ├── api/                # API请求封装
│   │   ├── components/         # 通用组件
│   │   ├── features/           # 功能模块
│   │   ├── hooks/              # 自定义Hook
│   │   ├── layouts/            # 布局组件
│   │   ├── pages/              # 页面组件
│   │   ├── services/           # 业务服务
│   │   ├── store/              # Redux状态
│   │   ├── styles/             # 全局样式
│   │   ├── types/              # TypeScript类型
│   │   └── utils/              # 工具函数
│   └── package.json
│
├── server/                     # 后端应用
│   ├── src/
│   │   ├── config/             # 配置文件
│   │   ├── controllers/        # 控制器
│   │   ├── dto/                # 数据传输对象
│   │   ├── errors/             # 自定义错误
│   │   ├── interfaces/         # 接口定义
│   │   ├── middleware/         # 中间件
│   │   ├── repositories/       # 数据仓库
│   │   ├── routes/             # 路由定义
│   │   ├── services/           # 业务服务
│   │   ├── types/              # 类型定义
│   │   ├── utils/              # 工具函数
│   │   └── app.ts              # Express应用
│   ├── prisma/
│   │   ├── schema.prisma       # 数据库模型
│   │   └── migrations/         # 数据库迁移
│   └── tests/                  # 测试文件
│
├── docs/                       # 项目文档
├── scripts/                    # 脚本文件
├── docker-compose.yml          # Docker编排
└── README.md
```

### 后端分层架构
```
表现层 (Presentation Layer)
├── Routes        # 路由定义
├── Controllers   # 请求处理
└── Middleware     # 中间件

业务逻辑层 (Business Logic Layer)
├── Services      # 业务逻辑
└── DTOs          # 数据传输对象

数据访问层 (Data Access Layer)
├── Repositories  # 数据访问抽象
└── Prisma        # ORM操作
```

## 快速开始

### 环境要求
- Node.js 18+
- PostgreSQL 15+
- npm 或 yarn
- Docker (可选)

### 安装步骤

#### 1. 克隆项目
```bash
git clone https://github.com/1gggllll/Task-Management-System.git
cd Task-Management-System
```

#### 2. 安装依赖
```bash
# 安装根目录依赖
npm install

# 安装前端依赖
cd client && npm install

# 安装后端依赖
cd ../server && npm install
```

#### 3. 配置环境变量
```bash
# 复制环境变量文件
cp .env.example .env

# 编辑.env文件，配置数据库连接等信息
```

#### 4. 初始化数据库
```bash
# 使用自动初始化脚本
npm run db:setup

# 或者手动执行
cd server
npx prisma migrate dev
npx prisma generate
npm run db:seed
```

#### 5. 启动开发服务器
```bash
# 同时启动前端和后端
npm run dev

# 或者分别启动
npm run dev:client  # 前端 http://localhost:5173
npm run dev:server  # 后端 http://localhost:3000
```

### Docker部署
```bash
# 开发环境
docker-compose -f docker-compose.dev.yml up

# 生产环境
docker-compose -f docker-compose.prod.yml up
```

## API文档

### 认证模块
| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/v1/auth/register | 用户注册 |
| POST | /api/v1/auth/login | 用户登录 |
| GET | /api/v1/auth/profile | 获取用户信息 |
| PUT | /api/v1/auth/profile | 更新用户信息 |

### 项目模块
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/v1/projects | 获取项目列表 |
| POST | /api/v1/projects | 创建项目 |
| GET | /api/v1/projects/:id | 获取项目详情 |
| PUT | /api/v1/projects/:id | 更新项目 |
| DELETE | /api/v1/projects/:id | 删除项目 |
| POST | /api/v1/projects/:id/members | 添加项目成员 |
| DELETE | /api/v1/projects/:id/members/:userId | 移除项目成员 |

### 任务模块
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/v1/projects/:projectId/tasks | 获取项目任务 |
| POST | /api/v1/projects/:projectId/tasks | 创建任务 |
| GET | /api/v1/tasks/:id | 获取任务详情 |
| PUT | /api/v1/tasks/:id | 更新任务 |
| DELETE | /api/v1/tasks/:id | 删除任务 |
| PATCH | /api/v1/tasks/:id/status | 更新任务状态 |
| PATCH | /api/v1/tasks/:id/assignee | 分配任务 |

### 响应格式
```json
{
  "success": true,
  "data": {},
  "message": "操作成功"
}
```

### 错误响应
```json
{
  "success": false,
  "error": {
    "message": "错误信息",
    "code": "ERROR_CODE"
  }
}
```

## 测试

### 运行测试
```bash
# 运行所有测试
npm test

# 运行前端测试
npm run test:client

# 运行后端测试
npm run test:server

# 运行测试并生成覆盖率报告
npm run test:coverage
```

### 测试账户
```
管理员: admin@example.com / password123
普通用户: user@example.com / password123
```

## 开发规范

### 代码风格
- 使用ESLint进行代码检查
- 使用Prettier进行代码格式化
- 命名规范：
  - 变量/函数：camelCase
  - 类/接口：PascalCase
  - 常量：UPPER_SNAKE_CASE
  - 文件名：kebab-case

### 提交规范
遵循Conventional Commits规范：
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

类型：feat, fix, docs, style, refactor, test, chore

### 分支策略
- **main**: 生产分支，完整的且功能实现完全无bug的分支
- **dev**: 开发分支，每次只在这个分支上开发
- **feature/***: 功能分支

## 部署

### 生产环境部署
1. 配置环境变量
2. 构建项目：`npm run build`
3. 运行数据库迁移：`npx prisma migrate deploy`
4. 启动服务：`npm start`

### Docker部署
```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d
```

## 相关文档
- [项目开发手册](./项目开发手册.md) - 分阶段开发计划
- [Git操作手册](./git操作手册.md) - Git操作规范
- [API文档](./docs/api.md) - 详细API文档
- [数据库设计](./docs/database.md) - 数据库设计文档

## 贡献指南
1. Fork项目
2. 创建功能分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m 'feat: add some feature'`
4. 推送分支：`git push origin feature/your-feature`
5. 创建Pull Request

## 许可证
MIT License

## 联系方式
- 项目地址: https://github.com/1gggllll/Task-Management-System
- 问题反馈: https://github.com/1gggllll/Task-Management-System/issues