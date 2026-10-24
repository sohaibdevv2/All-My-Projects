import React from 'react';
import { AppId, HighScores } from '../../types';
import { Play, Trophy, Sparkles, Gamepad2, Flame, Crosshair, HelpCircle } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface ArcadeHubAppProps {
  onLaunchGame: (appId: AppId) => void;
  highScores: HighScores;
}

export const ArcadeHubApp: React.FC<ArcadeHubAppProps> = ({ onLaunchGame, highScores }) => {
  const games = [
    {
      id: 'mario' as AppId,
      name: 'Super Mario Bros Arcade',
      tagline: 'Classic 1985 2D Platformer',
      description: 'Run, jump, smash bricks, collect coins, stomp Goombas and rescue the kingdom in this faithful canvas remake.',
      icon: '🍄',
      color: 'from-red-600 to-amber-600',
      badge: 'POPULAR',
      score: highScores.mario,
      controls: 'WASD / Arrows to run, Space to Jump, Shift to Sprint'
    },
    {
      id: 'racing' as AppId,
      name: 'Turbo Nitro Highway Racer',
      tagline: 'Outrun 80s High-Speed Arcade',
      description: 'Weave through rush hour highway traffic, hit nitro boosts, grab fuel cans, and dodge oil slicks at over 240 KM/H.',
      icon: '🏎️',
      color: 'from-orange-600 to-rose-600',
      badge: 'FAST PACED',
      score: highScores.racing,
      controls: 'A/D or Arrows to Steer, Space for Nitro Boost'
    },
    {
      id: 'invaders' as AppId,
      name: 'Galaxy Invader 1982',
      tagline: 'Retro Space Shooter',
      description: 'Defend Earth from descending waves of alien armadas, take shelter behind destructible bunkers, and target the red mystery UFO.',
      icon: '👾',
      color: 'from-emerald-600 to-teal-600',
      badge: 'RETRO CLASSIC',
      score: highScores.invaders,
      controls: 'Arrow Keys to Move, Space to Fire Laser'
    },
    {
      id: 'snake' as AppId,
      name: 'Neon Snake 3310',
      tagline: 'Arcade Phosphor Snake',
      description: 'Classic nostalgic snake with CRT phosphor green mode, speed multipliers, and bonus golden fruit.',
      icon: '🐍',
      color: 'from-cyan-600 to-blue-600',
      badge: 'NOSTALGIC',
      score: highScores.snake,
      controls: 'Arrow Keys or WASD to turn'
    }
  ];

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 overflow-y-auto p-5 font-sans select-none">
      {/* Header / Hero */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 p-6 border border-white/10 shadow-xl mb-6">
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center space-x-2 text-xs font-bold text-sky-400 uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Windows 11 Game Pass Retro Collection</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">
            Retro Arcade Games
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Play iconic arcade remakes directly on your Windows 11 desktop. Stomp goombas in Super Mario, blaze highways in Turbo Nitro, or defend against Space Invaders!
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                sounds.playMarioCoin();
                onLaunchGame('mario');
              }}
              className="flex items-center space-x-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg transition active:scale-95 text-xs"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>PLAY MARIO NOW</span>
            </button>
            <button
              onClick={() => {
                sounds.playNitroBoost();
                onLaunchGame('racing');
              }}
              className="flex items-center space-x-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-lg transition active:scale-95 text-xs"
            >
              <Flame className="w-4 h-4" />
              <span>PLAY RACING</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Featured Games Grid */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center space-x-2 text-white">
          <Gamepad2 className="w-5 h-5 text-sky-400" />
          <span>Installed Arcade Classics</span>
        </h2>
        <span className="text-xs text-slate-400">4 Games Ready to Play</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {games.map(game => (
          <div
            key={game.id}
            className="group relative rounded-xl bg-slate-800/80 border border-slate-700/60 p-4 hover:border-sky-500/50 hover:bg-slate-800 transition duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center text-2xl shadow-md group-hover:scale-105 transition`}>
                    {game.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-sky-300 transition">
                      {game.name}
                    </h3>
                    <p className="text-xs text-slate-400">{game.tagline}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-700 text-sky-300">
                  {game.badge}
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                {game.description}
              </p>

              <div className="text-[11px] text-slate-400 bg-slate-900/60 rounded-lg p-2 mb-3">
                <span className="text-slate-300 font-semibold">Controls:</span> {game.controls}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
              <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-mono">
                <Trophy className="w-3.5 h-3.5" />
                <span>Best: {game.score || 0}</span>
              </div>

              <button
                onClick={() => {
                  sounds.playClick();
                  onLaunchGame(game.id);
                }}
                className="flex items-center space-x-1.5 px-4 py-1.5 bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-semibold rounded-lg text-xs shadow transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Game</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Arcade High Scores & Leaderboard */}
      <div className="rounded-xl bg-slate-800/60 border border-slate-700/60 p-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2 mb-3">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Local Hall of Fame High Scores</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-900/80 rounded-lg p-2.5 border border-slate-800">
            <div className="text-xs text-slate-400">Super Mario</div>
            <div className="text-lg font-mono font-bold text-red-400">{highScores.mario || 0}</div>
          </div>
          <div className="bg-slate-900/80 rounded-lg p-2.5 border border-slate-800">
            <div className="text-xs text-slate-400">Turbo Racer</div>
            <div className="text-lg font-mono font-bold text-orange-400">{highScores.racing || 0}</div>
          </div>
          <div className="bg-slate-900/80 rounded-lg p-2.5 border border-slate-800">
            <div className="text-xs text-slate-400">Space Invaders</div>
            <div className="text-lg font-mono font-bold text-emerald-400">{highScores.invaders || 0}</div>
          </div>
          <div className="bg-slate-900/80 rounded-lg p-2.5 border border-slate-800">
            <div className="text-xs text-slate-400">Neon Snake</div>
            <div className="text-lg font-mono font-bold text-cyan-400">{highScores.snake || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
