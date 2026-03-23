const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const RELEASE_DIR = path.join(ROOT, 'release');
const DIST_DIR = path.join(RELEASE_DIR, 'dist');

console.log('构建 Electron 应用...\n');

if (fs.existsSync(DIST_DIR)) fs.rmSync(DIST_DIR, { recursive: true, force: true });

console.log('构建 Next.js 静态文件...');
execSync('pnpm build:static', { stdio: 'inherit', cwd: ROOT });

const appDir = path.join(DIST_DIR, 'win-unpacked', 'resources', 'app');
fs.mkdirSync(appDir, { recursive: true });

console.log('复制应用文件...');
fs.cpSync(path.join(ROOT, 'out'), path.join(appDir, 'out'), { recursive: true });
fs.cpSync(path.join(ROOT, 'electron'), path.join(appDir, 'electron'), { recursive: true });

const minimalPkg = { name: 'zip-extractor', version: '1.0.0', main: 'electron/main.js' };
fs.writeFileSync(path.join(appDir, 'package.json'), JSON.stringify(minimalPkg, null, 2));

console.log('复制 Electron 运行时...');
const electronDist = path.join(ROOT, 'node_modules', 'electron', 'dist');
fs.cpSync(electronDist, path.join(DIST_DIR, 'win-unpacked'), { recursive: true });

const oldExe = path.join(DIST_DIR, 'win-unpacked', 'electron.exe');
const newExe = path.join(DIST_DIR, 'win-unpacked', 'ZIP解压工具.exe');
if (fs.existsSync(oldExe)) fs.renameSync(oldExe, newExe);

console.log('\n完成！输出: ' + path.join(DIST_DIR, 'win-unpacked'));
