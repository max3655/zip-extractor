#!/bin/bash
set -e

echo "🚀 开始构建 Electron 桌面应用..."

# 1. 构建静态文件
echo "📦 正在构建静态文件..."
pnpm build:static

# 2. 检测操作系统并打包
echo "🎨 正在打包桌面应用..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "检测到 Windows 系统，打包 Windows 版本..."
    pnpm electron:build:win
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "检测到 macOS 系统，打包 macOS 版本..."
    pnpm electron:build:mac
else
    echo "检测到 Linux 系统，打包 Linux 版本..."
    pnpm electron:build:linux
fi

echo "✅ 构建完成！"
echo "📁 安装包位置: release/"
