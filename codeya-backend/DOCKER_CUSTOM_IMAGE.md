# Docker 自定义镜像配置指南

## 📦 镜像配置说明

codeya-backend 的 Docker 配置支持使用自定义基础镜像，这在以下场景非常有用：
- 使用国内镜像源加速构建
- 使用企业内部镜像仓库
- 使用特定版本的 Go 镜像
- 支持多架构部署（ARM/AMD64）

## 🎯 快速使用

### 1. 使用默认镜像（Docker Hub）

不需要任何配置，直接构建即可：

```bash
docker-compose build backend
```

这会使用默认的 `golang:1.23-alpine` 镜像。

### 2. 使用阿里云镜像加速

参考 mini-study 项目配置，使用阿里云个人镜像仓库：

```bash
docker-compose build \
  --build-arg BASE_IMAGE=crpi-4otucz63tm2q5dhq.cn-beijing.personal.cr.aliyuncs.com/library-shiyu/golang:1.23-alpine \
  backend
```

### 3. 使用其他镜像源

```bash
# 使用腾讯云镜像
docker-compose build \
  --build-arg BASE_IMAGE=ccr.ccs.tencentyun.com/library/golang:1.23-alpine \
  backend

# 使用华为云镜像
docker-compose build \
  --build-arg BASE_IMAGE=swr.cn-north-4.myhuaweicloud.com/library/golang:1.23-alpine \
  backend

# 使用自定义镜像仓库
docker-compose build \
  --build-arg BASE_IMAGE=your-registry.com/golang:1.23-alpine \
  backend
```

## 🔧 永久配置方式

如果想永久使用某个镜像源，可以修改 `docker-compose.yml`：

```yaml
services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        # 修改这里的默认值
        BASE_IMAGE: crpi-4otucz63tm2q5dhq.cn-beijing.personal.cr.aliyuncs.com/library-shiyu/golang:1.23-alpine
```

或者修改 `Dockerfile` 的默认值：

```dockerfile
# 修改第 4 行的默认值
ARG BASE_IMAGE=crpi-4otucz63tm2q5dhq.cn-beijing.personal.cr.aliyuncs.com/library-shiyu/golang:1.23-alpine
```

## 🚀 多架构支持

Dockerfile 已经配置了多架构支持，可以构建 ARM 和 AMD64 版本：

### 构建 ARM64 版本（Apple Silicon）

```bash
docker buildx build \
  --platform linux/arm64 \
  -t codeya-backend:arm64 \
  .
```

### 构建 AMD64 版本（Intel/AMD）

```bash
docker buildx build \
  --platform linux/amd64 \
  -t codeya-backend:amd64 \
  .
```

### 构建多架构镜像

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t codeya-backend:latest \
  --push \
  .
```

## 📝 Makefile 集成

在 `Makefile` 中添加快速构建命令：

```makefile
# 使用阿里云镜像构建
docker-build-aliyun:
	docker-compose build \
	  --build-arg BASE_IMAGE=crpi-4otucz63tm2q5dhq.cn-beijing.personal.cr.aliyuncs.com/library-shiyu/golang:1.23-alpine \
	  backend

# 构建多架构镜像
docker-build-multiarch:
	docker buildx build \
	  --platform linux/amd64,linux/arm64 \
	  -t codeya-backend:latest \
	  .
```

使用：

```bash
make docker-build-aliyun
```

## 🌐 Go 代理配置

Dockerfile 中已经配置了国内 Go 代理，加速依赖下载：

```dockerfile
ENV GOPROXY=https://goproxy.cn,direct
ENV GOSUMDB=sum.golang.google.cn
```

如需修改为其他代理，可以在构建时覆盖：

```bash
docker build \
  --build-arg GOPROXY=https://goproxy.io,direct \
  -t codeya-backend:latest \
  .
```

## 📊 镜像对比

### Docker Hub 官方镜像
- **优点**: 最新版本，官方支持
- **缺点**: 国内下载速度慢
- **适用**: 海外服务器，CI/CD 环境

### 阿里云镜像
- **优点**: 国内速度快，稳定
- **缺点**: 需要登录访问（如果是私有仓库）
- **适用**: 国内开发环境，生产环境

### 企业内部镜像
- **优点**: 安全可控，符合企业规范
- **缺点**: 需要额外维护
- **适用**: 企业生产环境

## 🔐 私有镜像仓库认证

如果使用私有镜像仓库，需要先登录：

### Docker Hub
```bash
docker login
```

### 阿里云容器镜像服务
```bash
docker login --username=your_username crpi-4otucz63tm2q5dhq.cn-beijing.personal.cr.aliyuncs.com
```

### 自定义仓库
```bash
docker login your-registry.com
```

## 💡 最佳实践

### 1. 本地开发
使用默认镜像或国内镜像加速：
```bash
make docker-build
# 或
make docker-build-aliyun
```

### 2. CI/CD 环境
在 CI 配置中指定镜像源：
```yaml
# .github/workflows/docker.yml
- name: Build Docker image
  run: |
    docker-compose build \
      --build-arg BASE_IMAGE=${{ secrets.DOCKER_BASE_IMAGE }} \
      backend
```

### 3. 生产环境
使用稳定的镜像版本，锁定具体版本号：
```dockerfile
ARG BASE_IMAGE=golang:1.21.5-alpine3.19
```

## 🐛 故障排查

### 镜像拉取失败
```bash
# 检查镜像是否存在
docker pull golang:1.23-alpine

# 尝试使用代理
export HTTP_PROXY=http://proxy.example.com:8080
export HTTPS_PROXY=http://proxy.example.com:8080
docker build .
```

### 构建速度慢
```bash
# 使用国内镜像源
docker-compose build --build-arg BASE_IMAGE=<国内镜像> backend

# 使用构建缓存
docker-compose build --build-arg BUILDKIT_INLINE_CACHE=1 backend
```

### 多架构构建失败
```bash
# 创建并使用 buildx 构建器
docker buildx create --name mybuilder --use
docker buildx inspect --bootstrap

# 重新构建
docker buildx build --platform linux/amd64,linux/arm64 .
```

## 📚 参考资源

- [Docker Hub - Golang 官方镜像](https://hub.docker.com/_/golang)
- [阿里云容器镜像服务](https://cr.console.aliyun.com/)
- [Docker Buildx 文档](https://docs.docker.com/buildx/working-with-buildx/)
- [Go 代理配置](https://goproxy.cn/)

