@echo off
chcp 65001 >nul

echo === 任务管理系统设置 ===

:: 检查Node.js版本
echo 检查Node.js版本...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Node.js，请先安装Node.js 18+
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set node_version=%%i
echo Node.js版本: %node_version%

:: 检查Docker
echo 检查Docker...
docker -v >nul 2>&1
if %errorlevel% neq 0 (
    echo 警告: 未找到Docker，将使用手动安装方式
    set USE_DOCKER=false
) else (
    for /f "tokens=*" %%i in ('docker -v') do set docker_version=%%i
    echo Docker版本: %docker_version%
    set USE_DOCKER=true
)

:: 安装依赖
echo 安装项目依赖...
call npm install

if "%USE_DOCKER%"=="true" (
    echo 使用Docker启动数据库...
    call docker-compose -f docker-compose.dev.yml up -d
    
    echo 等待数据库启动...
    timeout /t 10 /nobreak >nul
    
    echo 运行数据库迁移...
    cd server
    call npm run db:migrate
    
    echo 生成Prisma客户端...
    call npm run db:generate
    
    echo 填充测试数据...
    call npm run db:seed
    
    cd ..
    
    echo 启动开发服务器...
    call npm run dev
) else (
    echo 请确保PostgreSQL数据库已启动
    echo 数据库连接字符串: postgresql://postgres:postgres@localhost:5432/taskdb
    
    echo 运行数据库迁移...
    cd server
    call npm run db:migrate
    
    echo 生成Prisma客户端...
    call npm run db:generate
    
    echo 填充测试数据...
    call npm run db:seed
    
    cd ..
    
    echo 启动开发服务器...
    call npm run dev
)

echo === 设置完成 ===
echo 前端地址: http://localhost:5173
echo 后端地址: http://localhost:3000
echo API文档: http://localhost:3000/api/v1
echo.
echo 测试账户:
echo 管理员: admin@example.com / password123
echo 普通用户: user@example.com / password123

pause