@echo off
chcp 65001 >nul

echo === 数据库自动初始化脚本 ===

:: 检查Node.js
echo 检查Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Node.js，请先安装Node.js 18+
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo Node.js版本: %NODE_VERSION%

:: 检查npm
echo 检查npm...
npm -v >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到npm
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo npm版本: %NPM_VERSION%

:: 检查PostgreSQL
echo 检查PostgreSQL...
psql --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('psql --version') do set PSQL_VERSION=%%i
    echo PostgreSQL版本: %PSQL_VERSION%
    set USE_LOCAL_DB=true
) else (
    echo 未找到PostgreSQL，将使用Docker
    set USE_LOCAL_DB=false
)

:: 检查Docker
echo 检查Docker...
docker -v >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('docker -v') do set DOCKER_VERSION=%%i
    echo Docker版本: %DOCKER_VERSION%
    set USE_DOCKER=true
) else (
    echo 未找到Docker，将使用本地数据库
    set USE_DOCKER=false
)

:: 安装依赖
echo 安装项目依赖...
call npm install

if %errorlevel% neq 0 (
    echo 错误: 安装依赖失败
    pause
    exit /b 1
)
echo 依赖安装完成

:: 安装服务器依赖
echo 安装服务器依赖...
cd server
call npm install

if %errorlevel% neq 0 (
    echo 错误: 安装服务器依赖失败
    pause
    exit /b 1
)
echo 服务器依赖安装完成

:: 安装客户端依赖
echo 安装客户端依赖...
cd ..\client
call npm install

if %errorlevel% neq 0 (
    echo 错误: 安装客户端依赖失败
    pause
    exit /b 1
)
echo 客户端依赖安装完成
cd ..

:: 启动数据库
if "%USE_DOCKER%"=="true" (
    echo 使用Docker启动数据库...
    call docker-compose -f docker-compose.dev.yml up -d
    
    if %errorlevel% neq 0 (
        echo 错误: 启动Docker数据库失败
        pause
        exit /b 1
    )
    
    echo Docker数据库启动成功
    
    :: 等待数据库启动
    echo 等待数据库启动...
    timeout /t 10 /nobreak >nul
) else if "%USE_LOCAL_DB%"=="true" (
    echo 使用本地PostgreSQL数据库...
    echo 请确保PostgreSQL服务已启动
) else (
    echo 错误: 未找到PostgreSQL或Docker
    echo 请安装PostgreSQL或Docker后重试
    pause
    exit /b 1
)

:: 创建数据库
echo 创建数据库...
cd server

:: 检查.env文件
if not exist .env (
    echo 创建.env文件...
    copy ..\.env.example .env
    echo .env文件创建完成
)

:: 运行数据库迁移
echo 运行数据库迁移...
call npx prisma migrate dev --name init

if %errorlevel% neq 0 (
    echo 错误: 数据库迁移失败
    pause
    exit /b 1
)
echo 数据库迁移完成

:: 生成Prisma客户端
echo 生成Prisma客户端...
call npx prisma generate

if %errorlevel% neq 0 (
    echo 错误: 生成Prisma客户端失败
    pause
    exit /b 1
)
echo Prisma客户端生成完成

:: 填充测试数据
echo 填充测试数据...
call npm run db:seed

if %errorlevel% neq 0 (
    echo 错误: 填充测试数据失败
    pause
    exit /b 1
)
echo 测试数据填充完成

cd ..

echo === 数据库初始化完成 ===
echo.
echo 数据库连接信息:
echo   数据库: PostgreSQL
echo   主机: localhost
echo   端口: 5432
echo   数据库名: taskdb
echo   用户名: postgres
echo   密码: postgres
echo.
echo 测试账户:
echo   管理员: admin@example.com / password123
echo   普通用户: user@example.com / password123
echo.
echo 启动命令:
echo   npm run dev  # 同时启动前端和后端
echo   npm run dev:client  # 只启动前端
echo   npm run dev:server  # 只启动后端

pause