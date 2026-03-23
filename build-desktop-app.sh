#!/bin/bash
# ZIP 解压工具 - 桌面应用打包脚本
# 使用方法: 在本地运行此脚本即可生成安装包

echo "========================================"
echo "ZIP 解压工具 - 桌面应用打包脚本"
echo "========================================"
echo ""

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未检测到 Node.js，请先安装 Node.js"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"
echo ""

# 检查 pnpm 是否安装
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  未检测到 pnpm，正在安装..."
    npm install -g pnpm
fi

echo "✅ pnpm 版本: $(pnpm -v)"
echo ""

# 安装依赖
echo "📦 正在安装依赖..."
pnpm install

# 构建静态文件
echo ""
echo "🏗️  正在构建应用..."
pnpm build:static

# 打包桌面应用
echo ""
echo "🎨 正在打包桌面应用..."
echo "请选择要打包的平台:"
echo "1) Windows (.exe)"
echo "2) macOS (.dmg)"
echo "3) Linux (.AppImage, .deb)"
echo "4) 全部平台"
echo ""
read -p "请输入选项 (1-4): " choice

case $choice in
    1)
        echo "打包 Windows 版本..."
        pnpm electron:build:win
        ;;
    2)
        echo "打包 macOS 版本..."
        pnpm electron:build:mac
        ;;
    3)
        echo "打包 Linux 版本..."
        pnpm electron:build:linux
        ;;
    4)
        echo "打包所有平台..."
        pnpm electron:build
        ;;
    *)
        echo "无效选项，打包当前平台..."
        pnpm electron:build
        ;;
esac

echo ""
echo "========================================"
echo "✅ 打包完成！"
echo "========================================"
echo ""
echo "📁 安装包位置: release/"
ls -lh release/ 2>/dev/null || echo "请查看 release 目录"
echo ""
echo "感谢使用 ZIP 解压工具！"
