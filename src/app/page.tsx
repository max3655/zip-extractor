'use client';

import React, { useState, useCallback, useEffect } from 'react';
import JSZip from 'jszip';
import { gunzipSync } from 'fflate';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { FileIcon, FolderIcon, Download, Trash2, FileArchive, AlertCircle, FileText, Image, Music, Video, FileCode, Archive, FolderOpen, HardDrive, Monitor } from 'lucide-react';

interface ExtractedFile { name: string; path: string; size: number; isDirectory: boolean; blob?: Blob; }

function parseTar(buffer: ArrayBuffer): ExtractedFile[] {
  const files: ExtractedFile[] = []; const view = new Uint8Array(buffer); let offset = 0;
  while (offset < view.length - 512) {
    let isEmpty = true; for (let i = 0; i < 512; i++) { if (view[offset + i] !== 0) { isEmpty = false; break; } }
    if (isEmpty) break; let name = ''; for (let i = 0; i < 100; i++) { const c = view[offset + i]; if (c === 0) break; name += String.fromCharCode(c); }
    let sizeStr = ''; for (let i = 124; i < 136; i++) { const c = view[offset + i]; if (c === 0 || c === 32) break; sizeStr += String.fromCharCode(c); }
    const size = parseInt(sizeStr, 8) || 0; const typeFlag = view[offset + 156]; const isDir = typeFlag === 53 || (size === 0 && name.endsWith('/'));
    let blob: Blob | undefined; if (!isDir && size > 0) { const content = view.slice(offset + 512, offset + 512 + size); const arr = new ArrayBuffer(size); new Uint8Array(arr).set(content); blob = new Blob([arr]); }
    const cleanName = name.replace(/^\.\//, '').replace(/\/$/, '');
    if (cleanName) files.push({ name: cleanName.split('/').pop() || cleanName, path: cleanName, size, isDirectory: isDir, blob }); offset += 512 + Math.ceil(size / 512) * 512;
  } return files;
}

function getFileIcon(filename: string, isDir: boolean) {
  if (isDir) return <FolderIcon className="w-5 h-5 text-amber-500" />;
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const icons: Record<string, React.ReactNode> = { jpg: <Image className="w-5 h-5 text-pink-500" />, png: <Image className="w-5 h-5 text-pink-500" />, gif: <Image className="w-5 h-5 text-pink-500" />, mp4: <Video className="w-5 h-5 text-purple-500" />, mp3: <Music className="w-5 h-5 text-green-500" />, pdf: <FileText className="w-5 h-5 text-red-500" />, js: <FileCode className="w-5 h-5 text-yellow-500" />, };
  return icons[ext] || <FileIcon className="w-5 h-5 text-blue-500" />;
}

export default function UnzipTool() {
  const [files, setFiles] = useState<ExtractedFile[]>([]); const [progress, setProgress] = useState(0); const [error, setError] = useState<string | null>(null);
  const [zipName, setZipName] = useState(''); const [dragging, setDragging] = useState(false); const [selected, setSelected] = useState<Set<number>>(new Set()); const [loading, setLoading] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // 检测 Electron 环境：通过 userAgent 或 process.versions.electron
    const checkDesktop = () => {
      const ua = navigator.userAgent.toLowerCase();
      const isElectron = ua.includes('electron') || typeof (window as any).process !== 'undefined';
      setIsDesktop(!!isElectron);
    };
    checkDesktop();
  }, []);

  const fmtSize = (b: number) => { if (!b) return '0 B'; const k = 1024, s = ['B','KB','MB','GB']; const i = Math.floor(Math.log(b)/Math.log(k)); return (b/Math.pow(k,i)).toFixed(2)+' '+s[i]; };

  const extract = async (file: File) => {
    setLoading(true); setError(null); setFiles([]); setSelected(new Set()); setProgress(0); setZipName(file.name);
    try {
      const name = file.name.toLowerCase(); let result: ExtractedFile[];
      if (name.endsWith('.tar.gz') || name.endsWith('.tgz')) { const buf = await file.arrayBuffer(); const arr = new Uint8Array(buf); setProgress(20); const dec = gunzipSync(arr); setProgress(50); const tarBuf = new ArrayBuffer(dec.length); new Uint8Array(tarBuf).set(dec); result = parseTar(tarBuf); setProgress(100); }
      else if (name.endsWith('.gz')) { const buf = await file.arrayBuffer(); const arr = new Uint8Array(buf); const dec = gunzipSync(arr); const tarBuf = new ArrayBuffer(dec.length); new Uint8Array(tarBuf).set(dec); result = [{ name: file.name.replace(/\.gz$/i,''), path: file.name.replace(/\.gz$/i,''), size: dec.length, isDirectory: false, blob: new Blob([tarBuf]) }]; }
      else if (name.endsWith('.zip')) { const zip = await JSZip.loadAsync(await file.arrayBuffer()); result = []; const entries = Object.keys(zip.files); for (let i = 0; i < entries.length; i++) { const entry = zip.files[entries[i]]; if (!entry.dir) { const blob = await entry.async('blob'); result.push({ name: entries[i].split('/').pop()||entries[i], path: entries[i], size: blob.size, isDirectory: false, blob }); } setProgress(Math.round((i+1)/entries.length*100)); } }
      else throw new Error('不支持此格式'); setFiles(result.filter(f => f.name?.trim()));
    } catch (e) { setError(e instanceof Error ? e.message : '解压失败'); } finally { setLoading(false); }
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files[0]) extract(e.dataTransfer.files[0]); };
  const handleFile = (f: File) => { const n = f.name.toLowerCase(); if (n.endsWith('.zip')||n.endsWith('.gz')||n.endsWith('.tar.gz')||n.endsWith('.tgz')) extract(f); else setError('支持: ZIP, GZ, TAR.GZ, TGZ'); };
  const downloadAll = async () => { const zip = new JSZip(); files.forEach(f => { if (f.blob) zip.file(f.path, f.blob); }); const url = URL.createObjectURL(await zip.generateAsync({type:'blob'})); const a = document.createElement('a'); a.href = url; a.download = '解压_'+zipName.replace(/\.(zip|gz|tar\.gz|tgz)$/i,'')+'.zip'; a.click(); URL.revokeObjectURL(url); };
  const downloadSel = async () => { const zip = new JSZip(); selected.forEach(i => { const f = files[i]; if (f.blob) zip.file(f.path, f.blob); }); const url = URL.createObjectURL(await zip.generateAsync({type:'blob'})); const a = document.createElement('a'); a.href = url; a.download = '选中_'+zipName.replace(/\.(zip|gz|tar\.gz|tgz)$/i,'')+'.zip'; a.click(); URL.revokeObjectURL(url); };
  const toggleSel = (i: number) => { const s = new Set(selected); if (s.has(i)) s.delete(i); else s.add(i); setSelected(s); };
  const selAll = () => { if (selected.size === files.length) setSelected(new Set()); else setSelected(new Set(files.map((_, i) => i))); };
  const clear = () => { setFiles([]); setError(null); setZipName(''); setSelected(new Set()); };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3"><Archive className="w-8 h-8 text-white"/><h1 className="text-2xl font-bold text-white">ZIP解压工具</h1><span className="ml-2 text-sm bg-white/20 px-3 py-1 rounded-full text-white">{isDesktop ? '桌面版' : '在线版'}</span></div>
        {!isDesktop && (<a href="/download" className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/30 transition-all hover:scale-105"><Monitor className="w-5 h-5"/><span>下载桌面版</span></a>)}
      </div>
      <div className="bg-slate-800/80 backdrop-blur px-6 py-4 border-b border-slate-700 flex items-center gap-4">
        <label className="cursor-pointer"><input type="file" accept=".zip,.gz,.tar.gz,.tgz" onChange={e=>e.target.files?.[0]&&handleFile(e.target.files[0])} className="hidden"/><div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-medium"><FolderOpen className="w-5 h-5"/><span>打开压缩包</span></div></label>
        {files.length > 0 && (<><button onClick={downloadAll} className="flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium"><Download className="w-5 h-5"/><span>解压全部</span></button>{selected.size > 0 && <button onClick={downloadSel} className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium"><Download className="w-5 h-5"/><span>解压选中({selected.size})</span></button>}<button onClick={clear} className="flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium"><Trash2 className="w-5 h-5"/><span>关闭</span></button></>)}
        <div className="flex-1"/>{zipName && <div className="text-slate-300 text-sm flex items-center gap-3 bg-slate-700/50 px-4 py-2 rounded-lg"><HardDrive className="w-4 h-4"/><span>{zipName}</span><span className="text-slate-500">|</span><span>{files.length}个文件</span><span className="text-slate-500">|</span><span>{fmtSize(files.reduce((s,f)=>s+f.size,0))}</span></div>}
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        {files.length === 0 && !loading && (<div className="flex-1 flex items-center justify-center p-8"><div onDrop={handleDrop} onDragOver={e=>{e.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)} className={"w-full max-w-2xl aspect-video border-3 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all "+(dragging?"border-indigo-400 bg-indigo-500/20 scale-[1.02]":"border-slate-600 hover:border-indigo-500 hover:bg-slate-800/50")}><div className={"p-8 rounded-full mb-8 "+(dragging?"bg-indigo-500/30":"bg-slate-700")}><FileArchive className={"w-24 h-24 "+(dragging?"text-indigo-300":"text-slate-400")}/></div><h2 className="text-3xl font-bold text-white mb-3">{dragging?"松开即可解压":"拖拽压缩包到此处"}</h2><p className="text-slate-400 text-lg mb-8">或点击上方「打开压缩包」按钮</p><div className="flex gap-4"><span className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">.ZIP</span><span className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-green-500/20 text-green-300 border border-green-500/30">.GZ</span><span className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">.TAR.GZ</span><span className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">.TGZ</span></div></div></div>)}
        {loading && (<div className="flex-1 flex items-center justify-center"><Card className="p-10 bg-slate-800 border-slate-700"><div className="flex flex-col items-center"><FileArchive className="w-20 h-20 text-indigo-400 animate-pulse mb-6"/><p className="text-xl font-medium text-white mb-2">正在解压...</p><p className="text-slate-400 mb-6">{zipName}</p><Progress value={progress} className="w-64 h-3"/><p className="text-indigo-400 mt-3 text-lg font-semibold">{progress}%</p></div></Card></div>)}
        {error && <div className="p-4"><Card className="p-5 bg-red-900/30 border-red-700 flex items-center gap-4 text-red-300"><AlertCircle className="w-6 h-6"/><div><p className="font-semibold text-lg">解压失败</p><p className="text-sm">{error}</p></div></Card></div>}
        {files.length > 0 && !loading && (<div className="flex-1 flex flex-col overflow-hidden"><div className="bg-slate-700/50 px-6 py-3 grid grid-cols-[40px_1fr_100px_80px] gap-4 text-sm font-semibold text-slate-300 border-b border-slate-600"><div className="flex items-center justify-center"><input type="checkbox" checked={selected.size===files.length} onChange={selAll} className="w-4 h-4 rounded"/></div><div>文件名</div><div className="text-right">大小</div><div className="text-right">类型</div></div><ScrollArea className="flex-1">{files.map((f,i)=>(<div key={i} onClick={()=>toggleSel(i)} onDoubleClick={()=>f.blob&&(()=>{const a=document.createElement('a');a.href=URL.createObjectURL(f.blob);a.download=f.name;a.click()})()} className={"grid grid-cols-[40px_1fr_100px_80px] gap-4 px-6 py-4 items-center cursor-pointer transition-colors "+(selected.has(i)?"bg-indigo-500/20":"hover:bg-slate-700/50")}><div className="flex justify-center"><input type="checkbox" checked={selected.has(i)} onChange={()=>toggleSel(i)} className="w-4 h-4" onClick={e=>e.stopPropagation()}/></div><div className="flex items-center gap-3"><div className="shrink-0">{getFileIcon(f.name,f.isDirectory)}</div><div><p className="font-medium text-white truncate">{f.name}</p><p className="text-xs text-slate-500 truncate">{f.path}</p></div></div><div className="text-right text-slate-400 text-sm">{f.isDirectory?"-":fmtSize(f.size)}</div><div className="text-right text-slate-500 text-sm">{f.isDirectory?"文件夹":f.name.split('.').pop()?.toUpperCase()||"文件"}</div></div>))}</ScrollArea><div className="bg-slate-700/50 px-6 py-3 flex items-center justify-between text-sm text-slate-300 border-t border-slate-600"><span>共{files.length}项{selected.size>0&&<span className="text-indigo-400 ml-2">已选{selected.size}项</span>}</span><span>总大小: {fmtSize(files.reduce((s,f)=>s+f.size,0))}</span></div></div>)}
      </div>
      <div className="bg-slate-800 px-6 py-3 text-center text-sm text-slate-500 border-t border-slate-700">双击文件可直接下载 · 数据本地处理安全可靠{!isDesktop && <span className="ml-2">· <a href="/download" className="text-amber-400 hover:text-amber-300 font-medium">下载桌面版离线使用</a></span>}</div>
    </div>
  );
}
