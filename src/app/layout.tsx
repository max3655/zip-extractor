import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'ZIP 解压工具',
    template: '%s | ZIP 解压工具',
  },
  description: '快速、安全的在线 ZIP 压缩包解压工具，支持拖拽上传、批量下载',
  keywords: [
    'ZIP解压',
    '压缩包解压',
    '在线解压',
    '文件解压',
    'ZIP工具',
    '压缩工具',
    'PWA应用',
  ],
  authors: [{ name: 'Coze Code' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  themeColor: '#4f46e5',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ZIP解压工具',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'ZIP 解压工具',
    description: '快速、安全的在线 ZIP 压缩包解压工具',
    type: 'website',
    locale: 'zh_CN',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="zh-CN">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body className={`antialiased`}>
        {isDev && <Inspector />}
        {children}
      </body>
    </html>
  );
}
