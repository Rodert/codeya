#!/bin/bash

# CodeYa Backend Docker 启动脚本

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  CodeYa Backend Docker 启动工具${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo -e "${RED}错误: Docker 未安装${NC}"
    echo "请先安装 Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}错误: Docker Compose 未安装${NC}"
    echo "请先安装 Docker Compose"
    exit 1
fi

# 使用 docker compose 或 docker-compose
DOCKER_COMPOSE="docker-compose"
if ! command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
fi

# 选择启动模式
echo "请选择启动模式："
echo "1) 仅启动 MySQL 和 Redis（本地开发后端）"
echo "2) 启动所有服务（MySQL + Redis + Backend）"
echo "3) 停止所有服务"
echo "4) 删除所有服务和数据"
echo "5) 查看服务状态"
echo "6) 查看日志"
echo ""
read -p "请输入选项 [1-6]: " choice

case $choice in
    1)
        echo -e "${YELLOW}正在启动 MySQL 和 Redis...${NC}"
        $DOCKER_COMPOSE up -d mysql redis
        echo ""
        echo -e "${GREEN}✓ MySQL 和 Redis 已启动${NC}"
        echo ""
        echo "连接信息："
        echo "  MySQL: localhost:3306"
        echo "    用户: codeya_user"
        echo "    密码: codeya_pass_2024"
        echo "    数据库: codeya"
        echo ""
        echo "  Redis: localhost:6379"
        echo "    密码: codeya_redis_2024"
        echo ""
        echo "查看日志: $DOCKER_COMPOSE logs -f mysql redis"
        ;;
    2)
        echo -e "${YELLOW}正在启动所有服务...${NC}"
        
        # 检查是否存在 .env 文件
        if [ ! -f ".env" ]; then
            echo -e "${YELLOW}警告: .env 文件不存在，正在创建...${NC}"
            if [ -f "env.example" ]; then
                cp env.example .env
                echo -e "${YELLOW}请编辑 .env 文件设置正确的配置${NC}"
            fi
        fi
        
        $DOCKER_COMPOSE up -d
        echo ""
        echo -e "${GREEN}✓ 所有服务已启动${NC}"
        echo ""
        echo "服务访问地址："
        echo "  Backend API: http://localhost:8080"
        echo "  健康检查: http://localhost:8080/api/v1/health"
        echo ""
        echo "查看后端日志: $DOCKER_COMPOSE logs -f backend"
        ;;
    3)
        echo -e "${YELLOW}正在停止所有服务...${NC}"
        $DOCKER_COMPOSE stop
        echo -e "${GREEN}✓ 所有服务已停止${NC}"
        ;;
    4)
        echo -e "${RED}警告: 这将删除所有容器和数据！${NC}"
        read -p "确定要继续吗？(yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            echo -e "${YELLOW}正在删除所有服务和数据...${NC}"
            $DOCKER_COMPOSE down -v
            echo -e "${GREEN}✓ 所有服务和数据已删除${NC}"
        else
            echo "操作已取消"
        fi
        ;;
    5)
        echo -e "${YELLOW}服务状态：${NC}"
        echo ""
        $DOCKER_COMPOSE ps
        ;;
    6)
        echo "选择要查看的日志："
        echo "1) 所有服务"
        echo "2) MySQL"
        echo "3) Redis"
        echo "4) Backend"
        echo ""
        read -p "请输入选项 [1-4]: " log_choice
        
        case $log_choice in
            1) $DOCKER_COMPOSE logs -f ;;
            2) $DOCKER_COMPOSE logs -f mysql ;;
            3) $DOCKER_COMPOSE logs -f redis ;;
            4) $DOCKER_COMPOSE logs -f backend ;;
            *) echo "无效选项" ;;
        esac
        ;;
    *)
        echo -e "${RED}无效选项${NC}"
        exit 1
        ;;
esac

