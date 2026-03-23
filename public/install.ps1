# ZIP解压工具 - 一键安装脚本
# 在 PowerShell 中运行此脚本

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ZIP 解压工具 - 一键安装" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js
Write-Host "检查 Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    Write-Host "已安装 Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "未检测到 Node.js，正在安装..." -ForegroundColor Yellow
    
    # 下载并安装 Node.js
    $nodeUrl = "https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi"
    $nodeMsi = "$env:TEMP\node-install.msi"
    
    Write-Host "正在下载 Node.js..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeMsi
    
    Write-Host "正在安装 Node.js..." -ForegroundColor Yellow
    Start-Process msiexec.exe -ArgumentList "/i $nodeMsi /quiet /norestart" -Wait
    
    # 刷新环境变量
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    Write-Host "Node.js 安装完成!" -ForegroundColor Green
}

# 安装 pnpm
Write-Host ""
Write-Host "检查 pnpm..." -ForegroundColor Yellow
try {
    $pnpmVersion = pnpm -v
    Write-Host "已安装 pnpm: $pnpmVersion" -ForegroundColor Green
} catch {
    Write-Host "正在安装 pnpm..." -ForegroundColor Yellow
    npm install -g pnpm
    Write-Host "pnpm 安装完成!" -ForegroundColor Green
}

# 创建项目目录
$projectDir = "C:\zip-extractor-tool"
Write-Host ""
Write-Host "创建项目目录: $projectDir" -ForegroundColor Yellow

if (Test-Path $projectDir) {
    Remove-Item -Recurse -Force $projectDir
}
New-Item -ItemType Directory -Path $projectDir | Out-Null

# 下载源码
Write-Host ""
Write-Host "正在下载源码..." -ForegroundColor Yellow
$sourceUrl = "https://b9dfbc59-d92d-4937-a5c1-e4512f327630.dev.coze.site/zip-extractor-desktop.tar.gz"
$sourceFile = "$projectDir\source.tar.gz"
Invoke-WebRequest -Uri $sourceUrl -OutFile $sourceFile

# 解压
Write-Host "正在解压..." -ForegroundColor Yellow
Set-Location $projectDir
tar -xzf source.tar.gz
Remove-Item source.tar.gz

# 安装依赖
Write-Host ""
Write-Host "正在安装依赖（这可能需要几分钟）..." -ForegroundColor Yellow
pnpm install
pnpm add -D electron electron-builder

# 打包
Write-Host ""
Write-Host "正在打包桌面应用（这可能需要几分钟）..." -ForegroundColor Yellow
pnpm electron:build:win

# 完成
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "安装完成!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 打开 release 目录
$releaseDir = Join-Path $projectDir "release"
if (Test-Path $releaseDir) {
    Write-Host "安装包位置: $releaseDir" -ForegroundColor Yellow
    Write-Host "正在打开文件夹..." -ForegroundColor Yellow
    explorer $releaseDir
} else {
    Write-Host "注意: 打包可能未完成，请检查错误信息" -ForegroundColor Red
}

Write-Host ""
Write-Host "按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
