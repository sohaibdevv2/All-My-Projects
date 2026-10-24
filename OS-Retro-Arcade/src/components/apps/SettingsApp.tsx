import React from 'react';
import { SystemSettings, WallpaperId } from '../../types';
import { Monitor, Volume2, Moon, Sun, Tv, RotateCcw, Palette, ShieldCheck, Sparkles } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface SettingsAppProps {
  settings: SystemSettings;
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => void;
  onResetScores: () => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({
  settings,
  onUpdateSettings,
  onResetScores
}) => {
  const wallpapers: Array<{ id: WallpaperId; name: string; desc: string; previewColor: string }> = [
    {
      id: 'bloom-dark',
      name: 'Windows 11 Bloom Dark',
      desc: 'Iconic cobalt & indigo flowing abstract flower',
      previewColor: 'from-blue-600 via-indigo-900 to-slate-950'
    },
    {
      id: 'windows-hero',
      name: 'Windows Hero Logo',
      desc: 'Iconic glowing angled blue 4-pane window',
      previewColor: 'from-sky-400 via-blue-600 to-slate-950'
    },
    {
      id: 'bloom-light',
      name: 'Windows 11 Bloom Light',
      desc: 'Bright clean ethereal petal flow',
      previewColor: 'from-sky-300 via-blue-200 to-slate-100'
    },
    {
      id: 'bliss-modern',
      name: 'Windows XP Bliss',
      desc: 'Legendary rolling green hills of classic Windows',
      previewColor: 'from-sky-400 via-emerald-500 to-emerald-800'
    },
    {
      id: 'synthwave',
      name: 'Radical 80s Synthwave',
      desc: 'Neon wireframe grid, purple sun & retro arcade vibes',
      previewColor: 'from-fuchsia-600 via-purple-900 to-slate-950'
    },
    {
      id: 'cyber-grid',
      name: 'Matrix Cyber Grid',
      desc: 'Deep black with neon emerald circuitry',
      previewColor: 'from-emerald-600 via-slate-900 to-black'
    }
  ];

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 font-sans p-6 overflow-y-auto select-none">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-lg">
          <Palette className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">System Settings</h1>
          <p className="text-xs text-slate-400">Personalization, Sound Effects, and Retro Arcade Settings</p>
        </div>
      </div>

      {/* Wallpapers Section */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2 mb-3">
          <Monitor className="w-4 h-4 text-sky-400" />
          <span>Desktop Wallpaper</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {wallpapers.map(wp => {
            const isCurrent = settings.wallpaper === wp.id;
            return (
              <button
                key={wp.id}
                onClick={() => {
                  sounds.playClick();
                  onUpdateSettings({ wallpaper: wp.id });
                }}
                className={`flex flex-col p-3 rounded-xl border text-left transition duration-150 ${
                  isCurrent
                    ? 'border-sky-500 bg-sky-950/40 ring-2 ring-sky-500/30'
                    : 'border-slate-800 bg-slate-800/60 hover:bg-slate-800 hover:border-slate-700'
                }`}
              >
                <div className={`h-20 w-full rounded-lg bg-gradient-to-br ${wp.previewColor} mb-2 shadow-inner border border-white/10`} />
                <div className="font-semibold text-xs text-white">{wp.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{wp.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Audio & Effects Section */}
      <div className="mb-8 space-y-4">
        <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-sky-400" />
          <span>Audio & Retro Display Effects</span>
        </h2>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-4">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-white">Synthesized Audio & Sound FX</div>
              <div className="text-[11px] text-slate-400">Windows chimes, Mario jumps, car engine revs, and space lasers</div>
            </div>
            <button
              onClick={() => {
                const next = !settings.soundEnabled;
                sounds.enabled = next;
                if (next) sounds.playMarioCoin();
                onUpdateSettings({ soundEnabled: next });
              }}
              className={`w-12 h-6 rounded-full transition relative ${settings.soundEnabled ? 'bg-sky-600' : 'bg-slate-700'}`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition top-0.5 absolute ${
                  settings.soundEnabled ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* CRT Filter */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-700/60">
            <div>
              <div className="text-xs font-semibold text-white flex items-center space-x-1.5">
                <Tv className="w-3.5 h-3.5 text-emerald-400" />
                <span>CRT Scanline Overlay (Retro TV)</span>
              </div>
              <div className="text-[11px] text-slate-400">Adds subtle authentic arcade CRT raster lines to games</div>
            </div>
            <button
              onClick={() => {
                sounds.playClick();
                onUpdateSettings({ crtFilter: !settings.crtFilter });
              }}
              className={`w-12 h-6 rounded-full transition relative ${settings.crtFilter ? 'bg-emerald-600' : 'bg-slate-700'}`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition top-0.5 absolute ${
                  settings.crtFilter ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Game Data & Reset */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-white">Reset Arcade High Scores</div>
          <div className="text-[11px] text-slate-400">Clear all local high scores for Mario, Racing, Invaders & Snake</div>
        </div>
        <button
          onClick={() => {
            sounds.playClick();
            onResetScores();
          }}
          className="flex items-center space-x-1 px-3 py-1.5 bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/50 rounded-lg text-xs font-semibold transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Scores</span>
        </button>
      </div>
    </div>
  );
};
