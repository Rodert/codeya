# Docker 快速入门

## 🚀 一分钟快速启动

### 方式1：使用启动脚本（推荐）

```bash
# 给脚本添加执行权限（首次运行）
chmod +x docker-start.sh

# 运行启动脚本
./docker-start.sh
```

根据提示选择：
- **选项 1**: 仅启动 MySQL 和 Redis（用于本地开发）
- **选项 2**: 启动所有服务（MySQL + Redis + Backend）

### 方式2：使用 Makefile

```bash
# 仅启动数据库（MySQL + Redis）
make docker-db

# 启动所有服务
make docker-up

# 查看所有可用命令
make help
```

### 方式3：直接使用 docker-compose

```bash
# 仅启动数据库
docker-compose up -d mysql redis

# 启动所有服务
docker-compose up -d
```

### 🌟 新特性：自定义基础镜像

如果需要使用阿里云或其他镜像源，可以通过 `--build-arg` 指定：

```bash
# 使用阿里云镜像加速构建
docker-compose build --build-arg BASE_IMAGE=crpi-4otucz63tm2q5dhq.cn-beijing.personal.cr.aliyuncs.com/library-shiyu/golang:1.21-alpine backend

# 使用其他镜像源
docker-compose build --build-arg BASE_IMAGE=your-registry/golang:1.21-alpine backend
```

## 📋 默认配置

### MySQL
- **端口**: 3306
- **数据库**: codeya
- **用户**: codeya_user
- **密码**: codeya_pass_2024
- **Root 密码**: codeya_root_2024

### Redis
- **端口**: 6379
- **密码**: codeya_redis_2024

### Backend API
- **端口**: 8080
- **健康检查**: http://localhost:8080/api/v1/health

## 🎯 常用场景

### 场景1：本地开发（推荐）

适合在 IDE 中调试代码的场景：

```bash
# 1. 启动数据库
make docker-db

# 2. 本地运行后端
cd cmd/server
go run main.go
```

### 场景2：完整 Docker 环境

适合测试完整部署环境：

```bash
# 1. 配置环境变量
cp env.example .env
# 编辑 .env 文件

# 2. 启动所有服务
make docker-up

# 3. 查看日志
make docker-logs
```

## 🔧 常用命令

### 查看状态
```bash
# 查看所有服务状态
docker-compose ps

# 或使用 make
make docker-ps
```

### 查看日志
```bash
# 查看所有日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f mysql
docker-compose logs -f redis
docker-compose logs -f backend
```

### 停止服务
```bash
# 停止所有服务
docker-compose stop

# 停止特定服务
docker-compose stop backend
```

### 重启服务
```bash
# 重启所有服务
docker-compose restart

# 重启特定服务
docker-compose restart backend
```

### 进入容器
```bash
# 进入 MySQL
docker-compose exec mysql mysql -u codeya_user -p codeya

# 进入 Redis
docker-compose exec redis redis-cli -a codeya_redis_2024

# 进入后端容器
docker-compose exec backend sh
```

## 🗑️ 清理

### 停止并删除容器（保留数据）
```bash
docker-compose down
```

### 删除所有容器和数据
```bash
docker-compose down -v

# 或使用 make（会提示确认）
make docker-clean
```

## ⚠️ 常见问题

### 1. 端口被占用
如果端口冲突，编辑 `docker-compose.yml` 修改端口映射：
```yaml
ports:
  - "13306:3306"  # MySQL
  - "16379:6379"  # Redis
  - "18080:8080"  # Backend
```

### 2. 后端无法连接数据库
检查服务是否正常启动：
```bash
docker-compose ps
```

查看数据库日志：
```bash
docker-compose logs mysql
```

### 3. 数据丢失
数据存储在 Docker volumes 中，除非使用 `-v` 参数删除，否则数据会保留。

查看数据卷：
```bash
docker volume ls | grep codeya
```

### 4. 需要重新初始化数据库
```bash
# 删除数据库容器和数据
docker-compose down -v

# 重新启动（会自动执行初始化脚本）
docker-compose up -d mysql redis
```

## 📚 更多信息

- 详细的 Docker 使用说明: [DOCKER.md](./DOCKER.md)
- API 文档: [DESIGN.md](./DESIGN.md)
- 项目总览: [README.md](./README.md)

## 🆘 获取帮助

```bash
# 查看所有 make 命令
make help

# 运行交互式启动脚本
./docker-start.sh
```

