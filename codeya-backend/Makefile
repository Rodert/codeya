.PHONY: build run test clean migrate

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
	@echo "mysql -u root -p codeya < scripts/migration/001_init_schema.sql"
	@echo "mysql -u root -p codeya < scripts/migration/002_init_data.sql"

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


