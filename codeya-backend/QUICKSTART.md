# 快速开始指南

## 前置要求

- Go 1.21+
- MySQL 8.0+
- Redis 6.0+

## 1. 安装依赖

```bash
cd codeya-backend
go mod download
```

## 2. 配置

复制配置文件并修改：

```bash
cp configs/config.yaml configs/config.local.yaml
```

编辑 `configs/config.local.yaml`，修改以下配置：

```yaml
database:
  host: "localhost"
  port: 3306
  user: "root"
  password: "your_password"  # 修改为你的数据库密码
  dbname: "codeya"           # 确保数据库已创建

redis:
  addr: "localhost:6379"
  password: ""               # 如果 Redis 有密码，请填写

wechat:
  app_id: "wxfa3a374d6067d17d"  # 你的小程序 AppID
  app_secret: "your_app_secret" # 你的小程序 AppSecret

jwt:
  secret: "your_jwt_secret_key_change_in_production"  # 修改为随机字符串
```

## 3. 创建数据库

```sql
CREATE DATABASE codeya CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 4. 初始化数据库表

```bash
mysql -u root -p codeya < scripts/migration/001_init_schema.sql
mysql -u root -p codeya < scripts/migration/002_init_data.sql
```

或使用 Makefile：

```bash
make migrate
```

## 5. 启动服务

使用 Makefile：

```bash
make run
```

或直接运行：

```bash
go run cmd/server/main.go
```

## 6. 测试接口

### 登录接口

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "code": "your_wechat_code"
  }'
```

### 获取积分

```bash
curl -X GET http://localhost:8080/api/v1/points/current \
  -H "Authorization: Bearer your_token"
```

## 常见问题

### 1. 数据库连接失败

- 检查 MySQL 是否启动
- 检查数据库用户名和密码是否正确
- 检查数据库 `codeya` 是否已创建

### 2. Redis 连接失败

- 检查 Redis 是否启动
- 检查 Redis 地址和端口是否正确
- 检查 Redis 是否需要密码

### 3. 微信登录失败

- 检查 `app_id` 和 `app_secret` 是否正确
- 检查 `code` 是否有效（`code` 只能使用一次）
- 检查网络是否能访问微信 API

### 4. 端口被占用

修改 `configs/config.yaml` 中的 `server.port` 配置。

## 下一步

- 查看 [DESIGN.md](./DESIGN.md) 了解详细的架构设计
- 查看 [API 文档](./DESIGN.md#八api接口设计) 了解所有 API 接口
- 开发小程序端，对接后端 API


