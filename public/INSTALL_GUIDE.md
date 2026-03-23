# ZIP 解压工具 - 一键安装版

## 方式一：一键安装（推荐）

在 Windows 上打开 **PowerShell**，复制粘贴以下命令并回车：

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://b9dfbc59-d92d-4937-a5c1-e4512f327630.dev.coze.site/install.ps1'))
```

这个命令会自动：
1. 下载项目源码
2. 安装 Node.js（如果没有）
3. 安装依赖
4. 生成桌面安装包
5. 自动打开安装包所在文件夹

---

## 方式二：手动安装（如果一键安装失败）

### 步骤 1：确保已安装 Node.js

打开 PowerShell，运行：
```powershell
node -v
```

如果显示版本号（如 `v18.x.x`），说明已安装。
如果没有，请去 https://nodejs.org/ 下载安装 LTS 版本。

### 步骤 2：运行以下命令

```powershell
# 创建目录
mkdir C:\zip-tool
cd C:\zip-tool

# 下载源码
Invoke-WebRequest -Uri "https://b9dfbc59-d92d-4937-a5c1-e4512f327630.dev.coze.site/zip-extractor-desktop.tar.gz" -OutFile "source.tar.gz"

# 解压
tar -xzf source.tar.gz

# 安装 pnpm
npm install -g pnpm

# 安装依赖
pnpm install
pnpm add -D electron electron-builder

# 打包
pnpm electron:build:win

# 打开结果目录
explorer release
```

---

## 方式三：直接使用网页版（无需下载）

访问：https://b9dfbc59-d92d-4937-a5c1-e4512f327630.dev.coze.site

功能完全一样，支持 ZIP、GZ、TAR.GZ 格式解压。

---

## 常见问题

### Q: 打包失败怎么办？
A: 确保网络连接正常，打包需要下载约 150MB 的 Electron 运行时。

### Q: 能否直接使用网页版？
A: 可以！网页版功能完整，支持安装到桌面（PWA），离线也可使用。

### Q: 支持 Mac 吗？
A: 支持。将打包命令改为 `pnpm electron:build:mac`
