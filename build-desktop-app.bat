@echo off
chcp 65001 >nul
REM ZIP 解压工具 - Windows 打包脚本

echo ========================================
echo ZIP 解压工具 - Windows 打包脚本
echo ========================================
echo.

REM 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 错误: 未检测到 Node.js，请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js 版本: %NODE_VERSION%
echo.

REM 检查 pnpm
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  未检测到 pnpm，正在安装...
    npm install -g pnpm
)

for /f "tokens=*" %%i in ('pnpm -v') do set PNPM_VERSION=%%i
echo ✅ pnpm 版本: %PNPM_VERSION%
echo.

REM 安装依赖
echo 📦 正在安装依赖...
call pnpm install
if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

REM 构建静态文件
echo.
echo 🏗️  正在构建应用...
call pnpm build:static
if %errorlevel% neq 0 (
    echo ❌ 构建失败
    pause
    exit /b 1
)

REM 打包 Windows 应用
echo.
echo 🎨 正在打包 Windows 应用...
call pnpm electron:build:win
if %errorlevel% neq 0 (
    echo ❌ 打包失败
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ 打包完成！
echo ========================================
echo.
echo 📁 安装包位置: release\
dir release\*.exe 2>nul
echo.
echo 感谢使用 ZIP 解压工具！
pause
