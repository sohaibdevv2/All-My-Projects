import React, { useState } from 'react';
import { AppId } from '../../types';
import { 
  Folder, HardDrive, Monitor, FileText, ChevronRight, ArrowLeft, ArrowRight, ArrowUp, 
  RotateCw, Search, Download, Image as ImageIcon, Sparkles, Gamepad2, FileCheck
} from 'lucide-react';
import { sounds } from '../../utils/audio';

interface FileExplorerAppProps {
  onLaunchGame: (appId: AppId) => void;
  onOpenFile?: (fileName: string) => void;
}

export const FileExplorerApp: React.FC<FileExplorerAppProps> = ({ onLaunchGame, onOpenFile }) => {
  const [currentPath, setCurrentPath] = useState<string>('This PC > Local Disk (C:) > Arcade Games');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const files = [
    {
      id: 'mario.exe',
      name: 'Super_Mario_Bros.exe',
      type: 'Application',
      size: '2.4 MB',
      date: '1985-09-13',
      icon: '🍄',
      appId: 'mario' as AppId
    },
    {
      id: 'racing.exe',
      name: 'Turbo_Highway_Racing.exe',
      type: 'Application',
      size: '3.8 MB',
      date: '1989-11-20',
      icon: '🏎️',
      appId: 'racing' as AppId
    },
    {
      id: 'invaders.exe',
      name: 'Space_Invaders_1982.exe',
      type: 'Application',
      size: '1.2 MB',
      date: '1982-04-12',
      icon: '👾',
      appId: 'invaders' as AppId
    },
    {
      id: 'snake.exe',
      name: 'Neon_Snake_3310.exe',
      type: 'Application',
      size: '850 KB',
      date: '1997-08-01',
      icon: '🐍',
      appId: 'snake' as AppId
    },
    {
      id: 'cheats.txt',
      name: 'Arcade_Cheat_Codes.txt',
      type: 'Text Document',
      size: '4 KB',
      date: '2026-09-18',
      icon: '📝',
      appId: 'notepad' as AppId
    }
  ];

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-200 select-none font-sans text-xs">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-800/80 border-b border-slate-700/60">
        <div className="flex items-center space-x-1">
          <button className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white">
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white">
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white">
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white">
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 mx-3 flex items-center px-2 py-1 bg-slate-950/60 rounded border border-slate-700/70 text-slate-300">
          <HardDrive className="w-3.5 h-3.5 mr-2 text-sky-400" />
          <span className="font-mono text-[11px] truncate">{currentPath}</span>
        </div>

        {/* Search */}
        <div className="flex items-center px-2 py-1 bg-slate-950/60 rounded border border-slate-700/70 text-slate-400 w-36">
          <Search className="w-3.5 h-3.5 mr-1" />
          <input
            type="text"
            placeholder="Search Games"
            className="bg-transparent border-none outline-none text-[11px] text-white w-full"
          />
        </div>
      </div>

      {/* Main Body with Sidebar + File List */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation Tree */}
        <div className="w-48 bg-slate-950/50 border-r border-slate-800 p-2 space-y-1 overflow-y-auto hidden sm:block">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
            Quick Access
          </div>
          <button className="flex items-center space-x-2 w-full px-2 py-1.5 rounded hover:bg-slate-800 text-slate-300 text-left">
            <Monitor className="w-4 h-4 text-sky-400" />
            <span>Desktop</span>
          </button>
          <button className="flex items-center space-x-2 w-full px-2 py-1.5 rounded hover:bg-slate-800 text-slate-300 text-left">
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Downloads</span>
          </button>
          <button className="flex items-center space-x-2 w-full px-2 py-1.5 rounded hover:bg-slate-800 text-slate-300 text-left">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Documents</span>
          </button>

          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-3 pb-1">
            This PC
          </div>
          <button className="flex items-center space-x-2 w-full px-2 py-1.5 rounded bg-sky-950/50 text-sky-300 font-semibold border border-sky-800/40 text-left">
            <Gamepad2 className="w-4 h-4 text-sky-400" />
            <span>Arcade Games (C:)</span>
          </button>
          <button className="flex items-center space-x-2 w-full px-2 py-1.5 rounded hover:bg-slate-800 text-slate-300 text-left">
            <HardDrive className="w-4 h-4 text-slate-400" />
            <span>Local Disk (D:)</span>
          </button>
        </div>

        {/* File Table */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-slate-900/60 p-2">
          <div className="grid grid-cols-12 px-3 py-1.5 border-b border-slate-800 text-[11px] font-semibold text-slate-400">
            <div className="col-span-6">Name</div>
            <div className="col-span-2 hidden md:block">Date modified</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2 text-right">Size</div>
          </div>

          <div className="space-y-0.5 mt-1">
            {files.map(file => {
              const isSelected = selectedItem === file.id;
              return (
                <div
                  key={file.id}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedItem(file.id);
                  }}
                  onDoubleClick={() => {
                    sounds.playStartupSound();
                    onLaunchGame(file.appId);
                  }}
                  className={`grid grid-cols-12 items-center px-3 py-2 rounded-lg cursor-pointer transition ${
                    isSelected ? 'bg-sky-600/30 border border-sky-500/50 text-white' : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="col-span-6 flex items-center space-x-2.5">
                    <span className="text-xl">{file.icon}</span>
                    <span className="font-medium truncate">{file.name}</span>
                  </div>
                  <div className="col-span-2 text-slate-400 hidden md:block">{file.date}</div>
                  <div className="col-span-2 text-slate-400">{file.type}</div>
                  <div className="col-span-2 text-right font-mono text-slate-400">{file.size}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between px-2">
            <span>{files.length} items</span>
            <span>💡 Double-click any game (.exe) to launch</span>
          </div>
        </div>
      </div>
    </div>
  );
};
