# Docker 部署指南

## 快速开始

### 1. 仅启动 MySQL 和 Redis

如果你只想使用 Docker 运行数据库服务，本地运行后端：

```bash
# 启动 MySQL 和 Redis
docker-compose up -d mysql redis

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f mysql redis
```

### 2. 启动完整服务（包括后端）

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看所有服务状态
docker-compose ps

# 查看后端日志
docker-compose logs -f backend
```

## 配置说明

### 环境变量

创建 `.env` 文件用于配置敏感信息：

```bash
cp .env.example .env
```

编辑 `.env` 文件，设置以下变量：

```bash
JWT_SECRET=your_strong_jwt_secret_here
WECHAT_APP_ID=your_wechat_app_id
WECHAT_APP_SECRET=your_wechat_app_secret
```

### 默认配置

- **MySQL**
  - 端口: 3306
  - 数据库: codeya
  - 用户: codeya_user
  - 密码: codeya_pass_2024
  - Root 密码: codeya_root_2024

- **Redis**
  - 端口: 6379
  - 密码: codeya_redis_2024

- **Backend**
  - 端口: 8080

## 数据库初始化

MySQL 容器启动时会自动执行 `scripts/migration/` 目录下的 SQL 脚本：
1. `001_init_schema.sql` - 创建数据库表结构
2. `002_init_data.sql` - 插入初始数据

## 常用命令

### 查看服务状态
```bash
docker-compose ps
```

### 查看日志
```bash
# 查看所有服务日志
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

### 删除服务和数据
```bash
# 停止并删除容器（保留数据卷）
docker-compose down

# 停止并删除容器和数据卷
docker-compose down -v
```

### 重新构建后端镜像
```bash
# 重新构建并启动
docker-compose up -d --build backend
```

## 数据持久化

数据通过 Docker volumes 持久化存储：
- `mysql_data`: MySQL 数据
- `redis_data`: Redis 数据

查看数据卷：
```bash
docker volume ls | grep codeya
```

## 连接数据库

### 从宿主机连接

```bash
# 连接 MySQL
mysql -h 127.0.0.1 -P 3306 -u codeya_user -p
# 密码: codeya_pass_2024

# 连接 Redis
redis-cli -h 127.0.0.1 -p 6379 -a codeya_redis_2024
```

### 从容器内连接

```bash
# 进入 MySQL 容器
docker-compose exec mysql mysql -u codeya_user -p codeya

# 进入 Redis 容器
docker-compose exec redis redis-cli -a codeya_redis_2024
```

## 本地开发

如果你想在本地开发，只使用 Docker 运行数据库：

```bash
# 1. 启动数据库服务
docker-compose up -d mysql redis

# 2. 本地运行后端（使用本地配置）
cd cmd/server
go run main.go
```

## 生产环境配置

生产环境部署建议：

1. **修改所有默认密码**
   - MySQL root 密码
   - MySQL 用户密码
   - Redis 密码
   - JWT Secret

2. **修改配置文件**
   - 将 `server.mode` 改为 `release`
   - 配置正确的微信小程序凭证

3. **使用 HTTPS**
   - 配置 Nginx 反向代理
   - 申请 SSL 证书

4. **数据备份**
   - 定期备份 MySQL 数据
   - 定期备份 Redis 数据（如需要）

## 故障排查

### MySQL 无法启动
```bash
# 查看详细日志
docker-compose logs mysql

# 检查数据卷
docker volume inspect codeya-backend_mysql_data

# 如需重置数据库
docker-compose down -v
docker-compose up -d mysql
```

### 后端无法连接数据库
```bash
# 检查网络连接
docker-compose exec backend ping mysql
docker-compose exec backend ping redis

# 检查环境变量
docker-compose exec backend env | grep DATABASE
docker-compose exec backend env | grep REDIS
```

### 端口冲突
如果端口已被占用，修改 `docker-compose.yml` 中的端口映射：
```yaml
ports:
  - "13306:3306"  # MySQL
  - "16379:6379"  # Redis
  - "18080:8080"  # Backend
```

## 性能优化

### MySQL 优化
编辑 `docker-compose.yml`，在 MySQL 的 command 部分添加：
```yaml
command:
  - --max-connections=200
  - --innodb-buffer-pool-size=1G
```

### Redis 优化
编辑 `docker-compose.yml`，在 Redis 的 command 部分添加：
```yaml
command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru
```

## 监控

### 健康检查
```bash
# 检查服务健康状态
docker-compose ps

# 查看后端健康接口
curl http://localhost:8080/api/v1/health
```

### 资源使用
```bash
# 查看容器资源使用情况
docker stats
```

