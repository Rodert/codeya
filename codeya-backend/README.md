# CodeYa 后端系统

## 项目简介

CodeYa 后端系统是为编程鸭小程序提供服务的后端 API 服务，使用 Golang + Gin + GORM + MySQL + Redis 构建。

## 技术栈

- **开发语言**: Golang 1.21+
- **Web 框架**: Gin
- **ORM 框架**: GORM
- **数据库**: MySQL 8.0+
- **缓存**: Redis
- **认证**: JWT

## 项目结构

```
codeya-backend/
├── cmd/
│   └── server/
│       └── main.go              # 应用入口
├── internal/
│   ├── config/                  # 配置管理
│   ├── model/                   # 数据模型
│   ├── repository/              # 数据访问层
│   ├── service/                 # 业务逻辑层
│   ├── handler/                 # HTTP 处理层
│   ├── middleware/              # 中间件
│   ├── cache/                   # Redis 客户端
│   └── util/                    # 工具函数
├── pkg/
│   └── wechat/                  # 微信 API 封装
├── configs/
│   └── config.yaml              # 配置文件
├── scripts/
│   └── migration/               # 数据库迁移脚本
├── go.mod
└── README.md
```

## 快速开始

### 1. 环境要求

- Go 1.21+
- MySQL 8.0+
- Redis 6.0+

### 2. 配置

复制配置文件并修改配置：

```bash
cp configs/config.yaml configs/config.local.yaml
# 修改 config.local.yaml 中的配置
```

### 3. 安装依赖

```bash
go mod download
```

### 4. 数据库初始化

执行数据库迁移脚本创建表结构。

### 5. 运行

```bash
go run cmd/server/main.go
```

## API 文档

详见 [DESIGN.md](./DESIGN.md)

## 开发规范

详见 [DESIGN.md](./DESIGN.md) 中的开发规范部分


