# 如何获取 ZIP 解压工具桌面安装包

## 方案一：本地打包（推荐⭐️）

### 第一步：下载项目源码
点击页面右上角的下载按钮，或使用 git clone：
\`\`\`bash
git clone [项目地址]
cd [项目目录]
\`\`\`

### 第二步：运行打包脚本
\`\`\`bash
# Linux/Mac
./build-desktop-app.sh

# Windows (PowerShell)
# 1. 安装 Node.js: https://nodejs.org/
# 2. 安装 pnpm: npm install -g pnpm
# 3. 运行打包命令
pnpm install
pnpm build:static
pnpm electron:build:win
\`\`\`

### 第三步：获取安装包
打包完成后，安装包位于 \`release/\` 目录：
- **Windows**: \`release/ZIP解压工具 Setup 1.0.0.exe\`
- **macOS**: \`release/ZIP解压工具-1.0.0.dmg\`
- **Linux**: \`release/zip-extractor-1.0.0-x86_64.AppImage\`

---

## 方案二：使用 PWA（无需下载）

如果不想打包，可以直接使用 PWA 版本：

1. 访问应用网址
2. 点击浏览器地址栏的"安装"图标
3. 或点击页面上的"安装到桌面"按钮

PWA 版本功能完整，支持离线使用，体验接近原生应用。

---

## 方案三：等待云端打包完成

云端正在尝试打包，但下载 Electron 运行时需要较长时间（117 MB）。

打包完成后，安装包会自动出现在本页面供下载。

---

## 打包命令速查表

| 平台 | 命令 |
|------|------|
| Windows | \`pnpm electron:build:win\` |
| macOS | \`pnpm electron:build:mac\` |
| Linux | \`pnpm electron:build:linux\` |
| 全平台 | \`pnpm electron:build\` |

---

## 系统要求

- **Windows**: Windows 7 及以上（64位）
- **macOS**: macOS 10.13 (High Sierra) 及以上
- **Linux**: Ubuntu 18.04 及以上，或其他主流发行版

---

## 问题排查

### 打包失败？
1. 确保已安装 Node.js 18 或以上版本
2. 确保网络连接正常（需要下载 Electron）
3. Windows 用户可能需要安装 Visual Studio Build Tools

### Windows 打包特别说明
Windows 首次打包可能需要安装：
- Windows Build Tools: \`npm install -g windows-build-tools\`
- 或安装 Visual Studio Build Tools

### macOS 打包特别说明
Mac 用户可能需要允许运行未签名应用：
\`\`\`bash
sudo spctl --master-disable
\`\`\`

---

需要帮助？请查看项目文档或提交 Issue。
