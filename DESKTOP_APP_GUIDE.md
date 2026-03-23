# ZIP 解压工具 - 桌面应用版

## 简介

这是一个基于 PWA (Progressive Web App) 技术的 ZIP 解压工具，可以像原生应用一样安装到您的桌面。

## 功能特性

- ✅ 拖拽上传 ZIP 文件
- ✅ 自动解压并显示进度
- ✅ 预览解压后的文件列表
- ✅ 单个文件下载
- ✅ 批量打包下载
- ✅ 支持安装到桌面
- ✅ 跨平台支持（Windows、Mac、Linux）
- ✅ 离线可用（首次加载后）

## 如何安装到桌面

### Chrome / Edge 浏览器

1. 访问应用网址
2. 点击地址栏右侧的"安装"图标（⊕）
3. 或者点击页面上的"安装到桌面"按钮
4. 确认安装

### Safari 浏览器（Mac）

1. 访问应用网址
2. 点击菜单栏的"文件"
3. 选择"添加到程序坞"
4. 确认添加

### Firefox 浏览器

1. 访问应用网址
2. 点击地址栏右侧的主菜单
3. 选择"安装此网站为应用"
4. 确认安装

## Electron 打包说明

如果您需要传统的桌面安装包（.exe、.dmg、.AppImage），可以使用以下命令：

### Windows 版本
```bash
pnpm electron:build:win
```

### macOS 版本
```bash
pnpm electron:build:mac
```

### Linux 版本
```bash
pnpm electron:build:linux
```

打包后的安装包会生成在 `release/` 目录中。

## 技术栈

- **前端框架**: Next.js 16
- **UI 组件**: shadcn/ui
- **样式**: Tailwind CSS
- **ZIP 处理**: JSZip
- **桌面应用**: Electron / PWA

## 使用说明

1. **上传文件**: 拖拽 ZIP 文件到上传区域，或点击选择文件
2. **查看文件**: 解压完成后，可以看到所有文件的列表
3. **下载文件**: 
   - 点击单个文件右侧的下载按钮
   - 或点击"全部下载"批量下载所有文件
4. **清空重置**: 点击"清空"按钮可以重新上传新文件

## 注意事项

- 仅支持 ZIP 格式的压缩包
- 所有解压操作都在浏览器本地完成，不上传到服务器
- 建议使用现代浏览器（Chrome、Edge、Firefox、Safari）
- 首次使用需要联网，之后支持离线使用

## 开发命令

```bash
# 开发模式
pnpm dev

# 构建
pnpm build

# 启动生产环境
pnpm start

# 类型检查
pnpm ts-check
```

## 许可证

MIT
