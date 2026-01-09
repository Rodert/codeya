# syntax=docker/dockerfile:1
# 基础镜像参数，默认使用 Docker Hub 官方镜像，可在构建时通过 --build-arg BASE_IMAGE=xxx 覆盖
# 如需使用阿里云镜像：--build-arg BASE_IMAGE=crpi-4otucz63tm2q5dhq.cn-beijing.personal.cr.aliyuncs.com/library-shiyu/golang:1.21-alpine
ARG BASE_IMAGE=golang:1.21-alpine
FROM ${BASE_IMAGE} AS builder

# 设置 Go 代理
ENV GOPROXY=https://goproxy.cn,direct
ENV GOSUMDB=sum.golang.google.cn

# 使用构建参数支持多架构
ARG TARGETARCH

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=${TARGETARCH} go build -o codeya-server ./cmd/server

FROM ${BASE_IMAGE}

# 安装必要的运行时依赖
RUN apk --no-cache add ca-certificates tzdata

# 设置时区
ENV TZ=Asia/Shanghai

WORKDIR /app
COPY --from=builder /app/codeya-server ./codeya-server
COPY configs configs

# 创建日志目录
RUN mkdir -p /app/logs

EXPOSE 8080
ENTRYPOINT ["/app/codeya-server"]

