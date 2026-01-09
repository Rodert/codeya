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

### 方式一：使用 Docker（推荐）

最简单的方式是使用 Docker Compose 一键启动所有服务：

#### 1. 仅启动数据库（MySQL + Redis）

适用于本地开发后端的场景：

```bash
# 使用启动脚本（交互式）
./docker-start.sh

# 或直接使用 docker-compose
docker-compose up -d mysql redis
```

#### 2. 启动完整服务（包括后端）

```bash
# 复制并配置环境变量
cp env.example .env
# 编辑 .env 文件，设置 JWT_SECRET 和微信配置

# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f backend
```

**服务地址：**
- Backend API: http://localhost:8080
- MySQL: localhost:3306 (用户: codeya_user, 密码: codeya_pass_2024)
- Redis: localhost:6379 (密码: codeya_redis_2024)

**详细的 Docker 使用说明请参考 [DOCKER.md](./DOCKER.md)**

#### 使用阿里云镜像加速（推荐国内用户）

如果构建速度较慢，可以使用国内镜像源：

```bash
# 使用阿里云镜像构建（参考 mini-study 配置）
make docker-build-aliyun

# 或直接使用 docker-compose
docker-compose build \
  --build-arg BASE_IMAGE=crpi-4otucz63tm2q5dhq.cn-beijing.personal.cr.aliyuncs.com/library-shiyu/golang:1.21-alpine \
  backend
```

**更多镜像配置选项请参考 [DOCKER_CUSTOM_IMAGE.md](./DOCKER_CUSTOM_IMAGE.md)**

### 方式二：本地开发

#### 1. 环境要求

- Go 1.21+
- MySQL 8.0+
- Redis 6.0+

#### 2. 启动数据库

```bash
# 使用 Docker 启动数据库
docker-compose up -d mysql redis
```

#### 3. 配置

复制配置文件并修改配置：

```bash
cp configs/config.yaml configs/config.local.yaml
# 修改 config.local.yaml 中的配置
```

#### 4. 安装依赖

```bash
go mod download
```

#### 5. 数据库初始化

数据库表结构会在首次启动 Docker 时自动初始化。如果手动初始化，执行：

```bash
mysql -h localhost -u codeya_user -p codeya < scripts/migration/001_init_schema.sql
mysql -h localhost -u codeya_user -p codeya < scripts/migration/002_init_data.sql
```

#### 6. 运行

```bash
cd cmd/server
go run main.go
```

## API 文档

详见 [DESIGN.md](./DESIGN.md)

## 开发规范

详见 [DESIGN.md](./DESIGN.md) 中的开发规范部分


