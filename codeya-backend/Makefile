.PHONY: build run test clean migrate deps fmt lint
.PHONY: docker-build docker-up docker-down docker-restart docker-logs
.PHONY: docker-db docker-db-stop docker-db-restart docker-clean

# ==================== 本地开发 ====================

# 构建项目
build:
	go build -o bin/server cmd/server/main.go

# 运行项目
run:
	go run cmd/server/main.go

# 运行测试
test:
	go test -v ./...

# 清理构建文件
clean:
	rm -rf bin/
	rm -rf logs/

# 数据库迁移（需要手动执行 SQL 脚本）
migrate:
	@echo "请手动执行 SQL 脚本："
	@echo "mysql -h localhost -u codeya_user -p codeya < scripts/migration/001_init_schema.sql"
	@echo "mysql -h localhost -u codeya_user -p codeya < scripts/migration/002_init_data.sql"

# 安装依赖
deps:
	go mod download
	go mod tidy

# 格式化代码
fmt:
	go fmt ./...

# 代码检查
lint:
	golangci-lint run ./...

# ==================== Docker 相关 ====================

# 构建 Docker 镜像（使用默认镜像源）
docker-build:
	docker-compose build

# 使用阿里云镜像构建（参考 mini-study 配置）
docker-build-aliyun:
	docker-compose build \
	  --build-arg BASE_IMAGE=crpi-4otucz63tm2q5dhq.cn-beijing.personal.cr.aliyuncs.com/library-shiyu/golang:1.21-alpine \
	  backend
	@echo "✓ 使用阿里云镜像构建完成"

# 使用自定义镜像构建
docker-build-custom:
	@read -p "请输入自定义镜像地址: " image; \
	docker-compose build --build-arg BASE_IMAGE=$$image backend
	@echo "✓ 使用自定义镜像构建完成"

# 启动所有服务（MySQL + Redis + Backend）
docker-up:
	docker-compose up -d
	@echo "✓ 所有服务已启动"
	@echo "Backend API: http://localhost:8080"
	@echo "查看日志: make docker-logs"

# 停止所有服务
docker-down:
	docker-compose down
	@echo "✓ 所有服务已停止"

# 重启所有服务
docker-restart:
	docker-compose restart
	@echo "✓ 所有服务已重启"

# 查看日志
docker-logs:
	docker-compose logs -f

# 仅启动数据库（MySQL + Redis）
docker-db:
	docker-compose up -d mysql redis
	@echo "✓ 数据库服务已启动"
	@echo "MySQL: localhost:3306 (用户: codeya_user, 密码: codeya_pass_2024)"
	@echo "Redis: localhost:6379 (密码: codeya_redis_2024)"

# 停止数据库服务
docker-db-stop:
	docker-compose stop mysql redis
	@echo "✓ 数据库服务已停止"

# 重启数据库服务
docker-db-restart:
	docker-compose restart mysql redis
	@echo "✓ 数据库服务已重启"

# 清理所有 Docker 容器和数据
docker-clean:
	@echo "警告: 这将删除所有容器和数据！"
	@read -p "确定要继续吗？(yes/no): " confirm; \
	if [ "$$confirm" = "yes" ]; then \
		docker-compose down -v; \
		echo "✓ 所有容器和数据已删除"; \
	else \
		echo "操作已取消"; \
	fi

# 查看服务状态
docker-ps:
	docker-compose ps

# 进入后端容器
docker-exec-backend:
	docker-compose exec backend sh

# 进入 MySQL 容器
docker-exec-mysql:
	docker-compose exec mysql mysql -u codeya_user -p codeya

# 进入 Redis 容器
docker-exec-redis:
	docker-compose exec redis redis-cli -a codeya_redis_2024

# ==================== 帮助 ====================

help:
	@echo "CodeYa Backend Makefile 命令"
	@echo ""
	@echo "本地开发:"
	@echo "  make build          - 构建项目"
	@echo "  make run            - 运行项目"
	@echo "  make test           - 运行测试"
	@echo "  make clean          - 清理构建文件"
	@echo "  make deps           - 安装依赖"
	@echo "  make fmt            - 格式化代码"
	@echo "  make lint           - 代码检查"
	@echo "  make migrate        - 数据库迁移"
	@echo ""
	@echo "Docker - 镜像构建:"
	@echo "  make docker-build   - 构建 Docker 镜像（默认镜像源）"
	@echo "  make docker-build-aliyun - 使用阿里云镜像构建（推荐国内用户）"
	@echo "  make docker-build-custom - 使用自定义镜像构建"
	@echo ""
	@echo "Docker - 完整服务:"
	@echo "  make docker-up      - 启动所有服务"
	@echo "  make docker-down    - 停止所有服务"
	@echo "  make docker-restart - 重启所有服务"
	@echo "  make docker-logs    - 查看日志"
	@echo "  make docker-ps      - 查看服务状态"
	@echo ""
	@echo "Docker - 仅数据库:"
	@echo "  make docker-db      - 启动数据库服务（MySQL + Redis）"
	@echo "  make docker-db-stop - 停止数据库服务"
	@echo "  make docker-db-restart - 重启数据库服务"
	@echo ""
	@echo "Docker - 工具:"
	@echo "  make docker-clean   - 清理所有容器和数据"
	@echo "  make docker-exec-backend - 进入后端容器"
	@echo "  make docker-exec-mysql   - 进入 MySQL 容器"
	@echo "  make docker-exec-redis   - 进入 Redis 容器"
	@echo ""
	@echo "📚 更多信息: 查看 DOCKER_CUSTOM_IMAGE.md 了解自定义镜像配置"


