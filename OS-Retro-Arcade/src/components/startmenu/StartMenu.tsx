import React, { useState } from 'react';
import { AppId, HighScores } from '../../types';
import { Search, Power, ChevronRight, Gamepad2, Settings, FileText, Calculator, RotateCcw, Shield, Sparkles } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchApp: (appId: AppId) => void;
  highScores: HighScores;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  isOpen,
  onClose,
  onLaunchApp,
  highScores
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPowerMenu, setShowPowerMenu] = useState(false);

  if (!isOpen) return null;

  const pinnedApps: Array<{ id: AppId; name: string; icon: string; badge?: string; color: string }> = [
    { id: 'mario', name: 'Super Mario', icon: '🍄', badge: '1985', color: 'bg-red-600' },
    { id: 'racing', name: 'Turbo Nitro', icon: '🏎️', badge: 'Racing', color: 'bg-orange-600' },
    { id: 'invaders', name: 'Space Invaders', icon: '👾', badge: '1982', color: 'bg-emerald-600' },
    { id: 'snake', name: 'Neon Snake', icon: '🐍', badge: '3310', color: 'bg-cyan-600' },
    { id: 'arcade-hub', name: 'Arcade Hub', icon: '🎮', badge: 'Collection', color: 'bg-purple-600' },
    { id: 'file-explorer', name: 'File Explorer', icon: '📁', color: 'bg-amber-600' },
    { id: 'settings', name: 'Settings', icon: '⚙️', color: 'bg-slate-600' },
    { id: 'notepad', name: 'Game Cheats', icon: '📝', color: 'bg-blue-600' },
    { id: 'calculator', name: 'Calculator', icon: '🧮', color: 'bg-indigo-600' }
  ];

  const filteredApps = pinnedApps.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute bottom-14 left-1/2 -translate-x-1/2 w-[540px] max-w-[95vw] h-[600px] max-h-[82vh] bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden text-slate-100 font-sans animate-in fade-in slide-in-from-bottom-6 duration-200"
    >
      {/* Search Input */}
      <div className="p-5 pb-3">
        <div className="flex items-center px-4 py-2.5 bg-slate-950/70 rounded-full border border-white/10 focus-within:border-sky-400/80 transition">
          <Search className="w-4 h-4 text-slate-400 mr-3" />
          <input
            type="text"
            placeholder="Type here to search games, files, settings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-400 w-full"
            autoFocus
          />
        </div>
      </div>

      {/* Pinned Section */}
      <div className="flex-1 overflow-y-auto px-6 py-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-white">Pinned Apps & Games</span>
          <span className="text-[11px] text-sky-400 cursor-pointer hover:underline">All apps &gt;</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
          {filteredApps.map(app => (
            <button
              key={app.id}
              onClick={() => {
                sounds.playClick();
                onLaunchApp(app.id);
                onClose();
              }}
              className="flex flex-col items-center p-3 rounded-xl hover:bg-white/10 active:scale-95 transition group text-center relative"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md group-hover:scale-105 transition mb-2 bg-slate-800/80 border border-white/10">
                {app.icon}
              </div>
              <span className="text-xs font-medium text-slate-200 group-hover:text-white truncate max-w-[90px]">
                {app.name}
              </span>
              {app.badge && (
                <span className="text-[9px] font-mono px-1.5 py-0.2 bg-white/10 rounded-full text-sky-300 mt-0.5">
                  {app.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Recommended / Recent Section */}
        <div className="pt-3 border-t border-white/10">
          <div className="text-xs font-bold text-white mb-2">Recommended & High Scores</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div
              onClick={() => {
                onLaunchApp('mario');
                onClose();
              }}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/10 cursor-pointer transition"
            >
              <div className="w-9 h-9 rounded-lg bg-red-950/60 border border-red-500/30 flex items-center justify-center text-lg">
                🍄
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Super Mario Bros</div>
                <div className="text-[11px] text-slate-400 font-mono">High Score: {highScores.mario || 0}</div>
              </div>
            </div>

            <div
              onClick={() => {
                onLaunchApp('racing');
                onClose();
              }}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/10 cursor-pointer transition"
            >
              <div className="w-9 h-9 rounded-lg bg-orange-950/60 border border-orange-500/30 flex items-center justify-center text-lg">
                🏎️
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Turbo Nitro Racing</div>
                <div className="text-[11px] text-slate-400 font-mono">High Score: {highScores.racing || 0}</div>
              </div>
            </div>

            <div
              onClick={() => {
                onLaunchApp('notepad');
                onClose();
              }}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/10 cursor-pointer transition"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-lg">
                📝
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Arcade_Cheat_Codes.txt</div>
                <div className="text-[11px] text-slate-400">Secret strategy manual</div>
              </div>
            </div>

            <div
              onClick={() => {
                onLaunchApp('arcade-hub');
                onClose();
              }}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/10 cursor-pointer transition"
            >
              <div className="w-9 h-9 rounded-lg bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-lg">
                🎮
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Arcade Hub</div>
                <div className="text-[11px] text-slate-400">View all 4 arcade games</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Profile Bar */}
      <div className="h-14 px-6 bg-slate-950/70 border-t border-white/10 flex items-center justify-between relative">
        <div className="flex items-center space-x-3 cursor-pointer hover:bg-white/5 p-1 rounded-lg transition">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow">
            W11
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Retro Gamer</div>
            <div className="text-[10px] text-emerald-400">● Online</div>
          </div>
        </div>

        {/* Power Button */}
        <div className="relative">
          <button
            onClick={() => setShowPowerMenu(!showPowerMenu)}
            className="w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition"
            title="Power"
          >
            <Power className="w-4 h-4" />
          </button>

          {showPowerMenu && (
            <div className="absolute right-0 bottom-12 w-40 bg-slate-900 border border-white/20 rounded-xl p-1 shadow-2xl z-50 animate-in fade-in zoom-in-95">
              <button
                onClick={() => {
                  sounds.playStartupSound();
                  setShowPowerMenu(false);
                  onClose();
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-white/10 rounded-lg text-xs text-slate-200"
              >
                Restart Session
              </button>
              <button
                onClick={() => {
                  sounds.playWhoosh(false);
                  setShowPowerMenu(false);
                  onClose();
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-white/10 rounded-lg text-xs text-slate-200"
              >
                Sleep Mode
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
