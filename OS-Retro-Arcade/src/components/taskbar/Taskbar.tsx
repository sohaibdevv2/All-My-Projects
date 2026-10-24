import React, { useState, useEffect } from 'react';
import { AppId, WindowInstance } from '../../types';
import { Wifi, Volume2, VolumeX, BatteryCharging, ChevronUp, Search, Layers, CloudSun } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface TaskbarProps {
  windows: WindowInstance[];
  activeWindowId: string | null;
  startMenuOpen: boolean;
  onToggleStartMenu: () => void;
  actionCenterOpen: boolean;
  onToggleActionCenter: () => void;
  onAppClick: (appId: AppId) => void;
  onShowDesktop: () => void;
  soundEnabled: boolean;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  activeWindowId,
  startMenuOpen,
  onToggleStartMenu,
  actionCenterOpen,
  onToggleActionCenter,
  onAppClick,
  onShowDesktop,
  soundEnabled
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      );
      setDateStr(
        now.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Pinned taskbar items
  const pinnedApps: Array<{ id: AppId; name: string; icon: string }> = [
    { id: 'mario', name: 'Super Mario', icon: '🍄' },
    { id: 'racing', name: 'Turbo Nitro', icon: '🏎️' },
    { id: 'invaders', name: 'Space Invaders', icon: '👾' },
    { id: 'snake', name: 'Neon Snake', icon: '🐍' },
    { id: 'arcade-hub', name: 'Arcade Hub', icon: '🎮' },
    { id: 'file-explorer', name: 'File Explorer', icon: '📁' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
    { id: 'notepad', name: 'Notepad', icon: '📝' },
    { id: 'calculator', name: 'Calculator', icon: '🧮' }
  ];

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute bottom-0 left-0 right-0 h-12 bg-slate-950/85 backdrop-blur-2xl border-t border-white/10 z-40 flex items-center justify-between px-3 select-none font-sans"
    >
      {/* Left side: Weather & Widgets */}
      <div className="flex items-center space-x-2 w-48 hidden md:flex">
        <button
          onClick={() => onAppClick('arcade-hub')}
          className="flex items-center space-x-2 px-2.5 py-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition text-xs"
          title="Windows Widgets / Arcade Status"
        >
          <CloudSun className="w-4 h-4 text-amber-400" />
          <div className="text-left leading-tight">
            <div className="text-[11px] font-semibold">72°F Sunny</div>
            <div className="text-[9px] text-slate-400">4 Games Online</div>
          </div>
        </button>
      </div>

      {/* Center: Windows 11 Taskbar Icons */}
      <div className="flex items-center space-x-1 sm:space-x-1.5 mx-auto">
        {/* Windows Start Button (Fluent 4 Blue Squares) */}
        <button
          onClick={() => {
            sounds.playClick();
            onToggleStartMenu();
          }}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition active:scale-90 ${
            startMenuOpen ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
          title="Start"
        >
          <div className="grid grid-cols-2 gap-0.5 w-4.5 h-4.5">
            <div className="w-2 h-2 bg-sky-400 rounded-sm"></div>
            <div className="w-2 h-2 bg-sky-400 rounded-sm"></div>
            <div className="w-2 h-2 bg-sky-400 rounded-sm"></div>
            <div className="w-2 h-2 bg-sky-400 rounded-sm"></div>
          </div>
        </button>

        {/* Search button */}
        <button
          onClick={() => {
            sounds.playClick();
            onToggleStartMenu();
          }}
          className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 text-slate-300 hover:text-white transition active:scale-95 hidden sm:flex"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Task View / Desktops */}
        <button
          onClick={onShowDesktop}
          className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 text-slate-300 hover:text-white transition active:scale-95 hidden sm:flex"
          title="Task View"
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Pinned & Running Apps */}
        {pinnedApps.map(app => {
          const runningWindow = windows.find(w => w.appId === app.id);
          const isRunning = !!runningWindow;
          const isActive = runningWindow && runningWindow.id === activeWindowId && !runningWindow.isMinimized;

          return (
            <button
              key={app.id}
              onClick={() => {
                sounds.playClick();
                onAppClick(app.id);
              }}
              className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition group active:scale-90 ${
                isActive
                  ? 'bg-white/20 shadow-inner'
                  : isRunning
                  ? 'bg-white/10 hover:bg-white/15'
                  : 'hover:bg-white/10'
              }`}
              title={app.name}
            >
              <span className="text-xl group-hover:scale-110 transition">{app.icon}</span>

              {/* Running Pill Indicator */}
              {isRunning && (
                <div
                  className={`absolute bottom-1 h-0.5 rounded-full transition-all ${
                    isActive ? 'w-4 bg-sky-400' : 'w-1.5 bg-slate-400'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Right side: System Tray & Clock */}
      <div className="flex items-center space-x-1.5">
        {/* Hidden Icons */}
        <button
          className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white hidden sm:block"
          title="Hidden Icons"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>

        {/* Network / Volume / Battery Combined Pill */}
        <button
          onClick={() => {
            sounds.playClick();
            onToggleActionCenter();
          }}
          className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg transition ${
            actionCenterOpen ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
          title="Quick Settings"
        >
          <Wifi className="w-3.5 h-3.5 text-slate-300" />
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-slate-300" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-rose-400" />
          )}
          <BatteryCharging className="w-3.5 h-3.5 text-emerald-400 hidden sm:block" />
        </button>

        {/* Live Clock & Date */}
        <button
          onClick={() => {
            sounds.playClick();
            onToggleActionCenter();
          }}
          className="px-2 py-1 rounded-lg hover:bg-white/10 text-right leading-tight transition"
          title="Date & Time"
        >
          <div className="text-xs font-semibold text-slate-200">{timeStr}</div>
          <div className="text-[10px] text-slate-400">{dateStr}</div>
        </button>

        {/* Show Desktop Line (Far Right Edge) */}
        <button
          onClick={() => {
            sounds.playWhoosh(false);
            onShowDesktop();
          }}
          className="w-1.5 h-8 border-l border-white/20 hover:bg-white/20 transition ml-1"
          title="Show Desktop"
        />
      </div>
    </div>
  );
};
