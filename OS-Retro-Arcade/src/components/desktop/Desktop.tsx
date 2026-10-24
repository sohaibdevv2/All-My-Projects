import React, { useState, useRef } from 'react';
import { AppId, WallpaperId } from '../../types';
import { sounds } from '../../utils/audio';
import { DesktopWallpaper } from './Wallpapers';
import { RefreshCw, Monitor, Sparkles, Gamepad2, FileText, Trash2, FolderPlus } from 'lucide-react';

interface DesktopProps {
  wallpaper: WallpaperId;
  crtFilter: boolean;
  onLaunchApp: (appId: AppId) => void;
  onOpenSettings: () => void;
  onChangeWallpaper?: (nextWallpaper: WallpaperId) => void;
  children: React.ReactNode;
}

export const Desktop: React.FC<DesktopProps> = ({
  wallpaper,
  crtFilter,
  onLaunchApp,
  onOpenSettings,
  onChangeWallpaper,
  children
}) => {
  const [selectedIcon, setSelectedIcon] = useState<AppId | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const wallpaperCycle: WallpaperId[] = [
    'bloom-dark',
    'windows-hero',
    'bloom-light',
    'bliss-modern',
    'synthwave',
    'cyber-grid'
  ];

  const handleNextWallpaper = () => {
    if (!onChangeWallpaper) return;
    const currentIndex = wallpaperCycle.indexOf(wallpaper);
    const nextIndex = (currentIndex + 1) % wallpaperCycle.length;
    sounds.playWhoosh(true);
    onChangeWallpaper(wallpaperCycle[nextIndex]);
  };

  // Desktop Icons list
  const desktopIcons: Array<{ id: AppId; name: string; icon: string; tag?: string }> = [
    { id: 'arcade-hub', name: 'Arcade Game Pass', icon: '🎮', tag: 'HUB' },
    { id: 'mario', name: 'Super Mario Bros', icon: '🍄', tag: '1985' },
    { id: 'racing', name: 'Turbo Nitro Racer', icon: '🏎️', tag: '80s' },
    { id: 'invaders', name: 'Space Invaders', icon: '👾', tag: '1982' },
    { id: 'snake', name: 'Neon Snake 3310', icon: '🐍', tag: 'Retro' },
    { id: 'file-explorer', name: 'File Explorer', icon: '📁' },
    { id: 'notepad', name: 'Arcade Cheats', icon: '📝' },
    { id: 'calculator', name: 'Calculator', icon: '🧮' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    sounds.playClick();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleDesktopClick = () => {
    setSelectedIcon(null);
    if (contextMenu) setContextMenu(null);
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      onClick={handleDesktopClick}
      className="relative w-screen h-screen overflow-hidden select-none font-sans"
    >
      {/* Dynamic Desktop Wallpaper */}
      <DesktopWallpaper wallpaper={wallpaper} />

      {/* Retro CRT Scanlines Overlay if enabled */}
      {crtFilter && (
        <div className="absolute inset-0 pointer-events-none z-30 opacity-35">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.6) 50%)',
              backgroundSize: '100% 4px'
            }}
          />
        </div>
      )}

      {/* Desktop Icons Grid */}
      <div className="relative z-10 p-4 grid grid-flow-col grid-rows-6 gap-3 w-fit h-[calc(100vh-60px)]">
        {desktopIcons.map(icon => {
          const isSelected = selectedIcon === icon.id;
          return (
            <div
              key={icon.id}
              onClick={(e) => {
                e.stopPropagation();
                sounds.playClick();
                setSelectedIcon(icon.id);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                sounds.playStartupSound();
                onLaunchApp(icon.id);
              }}
              className={`flex flex-col items-center justify-center w-20 h-22 p-1 rounded-xl cursor-pointer transition ${
                isSelected
                  ? 'bg-sky-500/30 border border-sky-400/60 shadow-lg'
                  : 'hover:bg-white/10 hover:border hover:border-white/20 border border-transparent'
              }`}
            >
              <div className="relative">
                <span className="text-3xl drop-shadow-md">{icon.icon}</span>
                {icon.tag && (
                  <span className="absolute -bottom-1 -right-1 text-[8px] font-bold px-1 rounded-full bg-red-600 text-white shadow">
                    {icon.tag}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium text-white text-center leading-tight mt-1 px-1 drop-shadow line-clamp-2">
                {icon.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Windows Layer Container */}
      {children}

      {/* Desktop Context Menu */}
      {contextMenu && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          className="absolute z-50 w-52 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl p-1.5 shadow-2xl text-xs text-slate-200 font-sans animate-in fade-in zoom-in-95"
        >
          <button
            onClick={() => {
              sounds.playClick();
              setContextMenu(null);
            }}
            className="flex items-center space-x-2 w-full px-3 py-1.5 hover:bg-white/10 rounded-lg text-left"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
            <span>Refresh Desktop</span>
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onLaunchApp('arcade-hub');
              setContextMenu(null);
            }}
            className="flex items-center space-x-2 w-full px-3 py-1.5 hover:bg-white/10 rounded-lg text-left"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Open Arcade Hub</span>
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onLaunchApp('notepad');
              setContextMenu(null);
            }}
            className="flex items-center space-x-2 w-full px-3 py-1.5 hover:bg-white/10 rounded-lg text-left"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>New Cheat Note</span>
          </button>
          <div className="h-px bg-white/10 my-1" />
          <button
            onClick={() => {
              handleNextWallpaper();
              setContextMenu(null);
            }}
            className="flex items-center space-x-2 w-full px-3 py-1.5 hover:bg-white/10 rounded-lg text-left"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Next Desktop Background</span>
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onOpenSettings();
              setContextMenu(null);
            }}
            className="flex items-center space-x-2 w-full px-3 py-1.5 hover:bg-white/10 rounded-lg text-left"
          >
            <Monitor className="w-3.5 h-3.5 text-purple-400" />
            <span>Personalize (Wallpapers)</span>
          </button>
        </div>
      )}
    </div>
  );
};
