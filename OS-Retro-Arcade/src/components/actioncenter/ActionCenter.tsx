import React, { useState } from 'react';
import { Wifi, Volume2, VolumeX, Moon, Sun, Tv, Sparkles, ChevronUp, Sliders, Calendar } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface ActionCenterProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  soundVolume: number;
  onChangeVolume: (vol: number) => void;
  crtFilter: boolean;
  onToggleCrt: () => void;
}

export const ActionCenter: React.FC<ActionCenterProps> = ({
  isOpen,
  onClose,
  soundEnabled,
  onToggleSound,
  soundVolume,
  onChangeVolume,
  crtFilter,
  onToggleCrt
}) => {
  const [wifiActive, setWifiActive] = useState(true);
  const [nightLight, setNightLight] = useState(false);
  const [brightness, setBrightness] = useState(100);

  if (!isOpen) return null;

  const today = new Date();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute bottom-14 right-3 w-80 bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl z-50 p-4 font-sans text-slate-100 select-none animate-in fade-in slide-in-from-bottom-6 duration-200 space-y-4"
    >
      {/* Quick Settings Grid */}
      <div className="grid grid-cols-3 gap-2">
        {/* Wi-Fi */}
        <button
          onClick={() => {
            sounds.playClick();
            setWifiActive(!wifiActive);
          }}
          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition ${
            wifiActive
              ? 'bg-sky-600/90 border-sky-400 text-white shadow-md'
              : 'bg-slate-800/80 border-white/10 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Wifi className="w-5 h-5 mb-1" />
          <span className="text-[11px] font-semibold">{wifiActive ? 'ArcadeNet' : 'Off'}</span>
        </button>

        {/* Sound FX */}
        <button
          onClick={() => {
            sounds.playClick();
            onToggleSound();
          }}
          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition ${
            soundEnabled
              ? 'bg-sky-600/90 border-sky-400 text-white shadow-md'
              : 'bg-slate-800/80 border-white/10 text-slate-400 hover:bg-slate-800'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5 mb-1" /> : <VolumeX className="w-5 h-5 mb-1" />}
          <span className="text-[11px] font-semibold">{soundEnabled ? 'Audio On' : 'Muted'}</span>
        </button>

        {/* CRT Scanline Filter */}
        <button
          onClick={() => {
            sounds.playClick();
            onToggleCrt();
          }}
          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition ${
            crtFilter
              ? 'bg-emerald-600/90 border-emerald-400 text-white shadow-md'
              : 'bg-slate-800/80 border-white/10 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Tv className="w-5 h-5 mb-1" />
          <span className="text-[11px] font-semibold">{crtFilter ? 'CRT Mode' : 'CRT Off'}</span>
        </button>
      </div>

      {/* Sliders */}
      <div className="space-y-3 pt-2">
        {/* Brightness */}
        <div className="flex items-center space-x-3">
          <Sun className="w-4 h-4 text-slate-400" />
          <input
            type="range"
            min="30"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />
        </div>

        {/* Volume */}
        <div className="flex items-center space-x-3">
          <Volume2 className="w-4 h-4 text-slate-400" />
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(soundVolume * 100)}
            onChange={(e) => onChangeVolume(Number(e.target.value) / 100)}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />
        </div>
      </div>

      {/* Mini Calendar */}
      <div className="pt-3 border-t border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-white">
            {monthNames[today.getMonth()]} {today.getFullYear()}
          </span>
          <span className="text-[11px] text-sky-400 font-mono">
            {today.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 text-center text-[10px] text-slate-400 font-medium mb-1">
          <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
        </div>

        {/* Days grid snippet */}
        <div className="grid grid-cols-7 text-center text-[11px] gap-1">
          {Array.from({ length: 31 }, (_, i) => i + 1).slice(0, 28).map((d) => {
            const isToday = d === today.getDate();
            return (
              <div
                key={d}
                className={`py-1 rounded-full text-center transition ${
                  isToday
                    ? 'bg-sky-500 text-white font-bold'
                    : 'hover:bg-white/10 text-slate-300'
                }`}
              >
                {d}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
