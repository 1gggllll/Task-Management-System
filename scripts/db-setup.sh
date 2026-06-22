#!/bin/bash

# 数据库自动初始化脚本

echo "=== 数据库自动初始化脚本 ==="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查Node.js
echo -e "${YELLOW}检查Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}错误: 未找到Node.js，请先安装Node.js 18+${NC}"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}Node.js版本: $NODE_VERSION${NC}"

# 检查npm
echo -e "${YELLOW}检查npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}错误: 未找到npm${NC}"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}npm版本: $NPM_VERSION${NC}"

# 检查PostgreSQL
echo -e "${YELLOW}检查PostgreSQL...${NC}"
if command -v psql &> /dev/null; then
    PSQL_VERSION=$(psql --version)
    echo -e "${GREEN}PostgreSQL版本: $PSQL_VERSION${NC}"
    USE_LOCAL_DB=true
else
    echo -e "${YELLOW}未找到PostgreSQL，将使用Docker${NC}"
    USE_LOCAL_DB=false
fi

# 检查Docker
echo -e "${YELLOW}检查Docker...${NC}"
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker -v)
    echo -e "${GREEN}Docker版本: $DOCKER_VERSION${NC}"
    USE_DOCKER=true
else
    echo -e "${YELLOW}未找到Docker，将使用本地数据库${NC}"
    USE_DOCKER=false
fi

# 安装依赖
echo -e "${YELLOW}安装项目依赖...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}错误: 安装依赖失败${NC}"
    exit 1
fi
echo -e "${GREEN}依赖安装完成${NC}"

# 安装服务器依赖
echo -e "${YELLOW}安装服务器依赖...${NC}"
cd server
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}错误: 安装服务器依赖失败${NC}"
    exit 1
fi
echo -e "${GREEN}服务器依赖安装完成${NC}"

# 安装客户端依赖
echo -e "${YELLOW}安装客户端依赖...${NC}"
cd ../client
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}错误: 安装客户端依赖失败${NC}"
    exit 1
fi
echo -e "${GREEN}客户端依赖安装完成${NC}"
cd ..

# 启动数据库
if [ "$USE_DOCKER" = true ]; then
    echo -e "${YELLOW}使用Docker启动数据库...${NC}"
    docker-compose -f docker-compose.dev.yml up -d
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}错误: 启动Docker数据库失败${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Docker数据库启动成功${NC}"
    
    # 等待数据库启动
    echo -e "${YELLOW}等待数据库启动...${NC}"
    sleep 10
elif [ "$USE_LOCAL_DB" = true ]; then
    echo -e "${YELLOW}使用本地PostgreSQL数据库...${NC}"
    echo -e "${YELLOW}请确保PostgreSQL服务已启动${NC}"
else
    echo -e "${RED}错误: 未找到PostgreSQL或Docker${NC}"
    echo -e "${YELLOW}请安装PostgreSQL或Docker后重试${NC}"
    exit 1
fi

# 创建数据库
echo -e "${YELLOW}创建数据库...${NC}"
cd server

# 检查.env文件
if [ ! -f .env ]; then
    echo -e "${YELLOW}创建.env文件...${NC}"
    cp ../.env.example .env
    echo -e "${GREEN}.env文件创建完成${NC}"
fi

# 运行数据库迁移
echo -e "${YELLOW}运行数据库迁移...${NC}"
npx prisma migrate dev --name init

if [ $? -ne 0 ]; then
    echo -e "${RED}错误: 数据库迁移失败${NC}"
    exit 1
fi
echo -e "${GREEN}数据库迁移完成${NC}"

# 生成Prisma客户端
echo -e "${YELLOW}生成Prisma客户端...${NC}"
npx prisma generate

if [ $? -ne 0 ]; then
    echo -e "${RED}错误: 生成Prisma客户端失败${NC}"
    exit 1
fi
echo -e "${GREEN}Prisma客户端生成完成${NC}"

# 填充测试数据
echo -e "${YELLOW}填充测试数据...${NC}"
npm run db:seed

if [ $? -ne 0 ]; then
    echo -e "${RED}错误: 填充测试数据失败${NC}"
    exit 1
fi
echo -e "${GREEN}测试数据填充完成${NC}"

cd ..

echo -e "${GREEN}=== 数据库初始化完成 ===${NC}"
echo ""
echo -e "${GREEN}数据库连接信息:${NC}"
echo -e "  数据库: PostgreSQL"
echo -e "  主机: localhost"
echo -e "  端口: 5432"
echo -e "  数据库名: taskdb"
echo -e "  用户名: postgres"
echo -e "  密码: postgres"
echo ""
echo -e "${GREEN}测试账户:${NC}"
echo -e "  管理员: admin@example.com / password123"
echo -e "  普通用户: user@example.com / password123"
echo ""
echo -e "${GREEN}启动命令:${NC}"
echo -e "  npm run dev  # 同时启动前端和后端"
echo -e "  npm run dev:client  # 只启动前端"
echo -e "  npm run dev:server  # 只启动后端"