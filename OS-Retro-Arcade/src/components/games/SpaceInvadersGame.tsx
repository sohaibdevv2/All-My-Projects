import React, { useEffect, useRef, useState } from 'react';
import { sounds } from '../../utils/audio';
import { Play, RotateCcw, Volume2, VolumeX, ArrowLeft, ArrowRight, Crosshair } from 'lucide-react';

interface SpaceInvadersGameProps {
  onScoreUpdate?: (score: number) => void;
}

export const SpaceInvadersGame: React.FC<SpaceInvadersGameProps> = ({ onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover' | 'victory'>('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const [soundMuted, setSoundMuted] = useState(false);

  const keysRef = useRef<{ left: boolean; right: boolean; shoot: boolean }>({
    left: false,
    right: false,
    shoot: false
  });

  const gameRef = useRef<{
    player: { x: number; y: number; w: number; h: number; speed: number; reload: number };
    bullets: Array<{ x: number; y: number; vy: number }>;
    alienBullets: Array<{ x: number; y: number; vy: number }>;
    aliens: Array<{
      x: number;
      y: number;
      w: number;
      h: number;
      type: 'squid' | 'crab' | 'octopus';
      alive: boolean;
      points: number;
    }>;
    shields: Array<{ x: number; y: number; hits: number }>;
    ufo: { x: number; y: number; active: boolean; speed: number } | null;
    alienDir: number;
    alienSpeed: number;
    alienStepTimer: number;
    alienStepFreq: number;
    stepSoundIdx: number;
    score: number;
    lives: number;
  }>({
    player: { x: 230, y: 440, w: 28, h: 18, speed: 4.5, reload: 0 },
    bullets: [],
    alienBullets: [],
    aliens: [],
    shields: [],
    ufo: null,
    alienDir: 1,
    alienSpeed: 1.2,
    alienStepTimer: 0,
    alienStepFreq: 30,
    stepSoundIdx: 0,
    score: 0,
    lives: 3
  });

  const initGame = (nextWave: number = 1) => {
    const aliens: typeof gameRef.current.aliens = [];
    const rows: Array<'squid' | 'crab' | 'crab' | 'octopus' | 'octopus'> = ['squid', 'crab', 'crab', 'octopus', 'octopus'];
    const pointsMap = { squid: 30, crab: 20, octopus: 10 };

    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 10; c++) {
        aliens.push({
          x: 60 + c * 38,
          y: 70 + r * 30,
          w: 24,
          h: 18,
          type: rows[r],
          alive: true,
          points: pointsMap[rows[r]]
        });
      }
    }

    // Shields
    const shields: typeof gameRef.current.shields = [];
    for (let s = 0; s < 4; s++) {
      const baseX = 80 + s * 105;
      for (let bx = 0; bx < 4; bx++) {
        for (let by = 0; by < 3; by++) {
          if (by === 2 && (bx === 1 || bx === 2)) continue; // archway
          shields.push({ x: baseX + bx * 8, y: 380 + by * 8, hits: 0 });
        }
      }
    }

    gameRef.current = {
      player: { x: 230, y: 440, w: 28, h: 18, speed: 4.5, reload: 0 },
      bullets: [],
      alienBullets: [],
      aliens,
      shields,
      ufo: null,
      alienDir: 1,
      alienSpeed: 1.0 + (nextWave - 1) * 0.3,
      alienStepTimer: 0,
      alienStepFreq: 32 - Math.min(20, nextWave * 2),
      stepSoundIdx: 0,
      score: nextWave === 1 ? 0 : gameRef.current.score,
      lives: nextWave === 1 ? 3 : gameRef.current.lives
    };

    setWave(nextWave);
    if (nextWave === 1) {
      setScore(0);
      setLives(3);
    }
    setGameState('playing');
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = true;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        keysRef.current.shoot = true;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = false;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        keysRef.current.shoot = false;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // Main Loop
  useEffect(() => {
    let animId: number;

    const loop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const g = gameRef.current;
      const p = g.player;

      if (gameState === 'playing') {
        // Player movement
        if (keysRef.current.left) p.x -= p.speed;
        if (keysRef.current.right) p.x += p.speed;
        if (p.x < 15) p.x = 15;
        if (p.x > canvas.width - p.w - 15) p.x = canvas.width - p.w - 15;

        // Player shooting
        if (p.reload > 0) p.reload--;
        if (keysRef.current.shoot && p.reload <= 0 && g.bullets.length < 2) {
          sounds.playInvaderLaser();
          g.bullets.push({ x: p.x + p.w / 2 - 2, y: p.y - 8, vy: -7 });
          p.reload = 18;
        }

        // Bullets update
        for (let i = g.bullets.length - 1; i >= 0; i--) {
          const b = g.bullets[i];
          b.y += b.vy;

          // Check hit shields
          for (let s = g.shields.length - 1; s >= 0; s--) {
            const sh = g.shields[s];
            if (b.x + 3 > sh.x && b.x < sh.x + 8 && b.y < sh.y + 8 && b.y + 8 > sh.y) {
              sh.hits++;
              if (sh.hits >= 3) g.shields.splice(s, 1);
              g.bullets.splice(i, 1);
              break;
            }
          }

          // Check hit aliens
          let hitAlien = false;
          for (const a of g.aliens) {
            if (a.alive && b.x + 3 > a.x && b.x < a.x + a.w && b.y < a.y + a.h && b.y + 8 > a.y) {
              a.alive = false;
              sounds.playMarioStomp();
              g.score += a.points;
              setScore(g.score);
              if (onScoreUpdate) onScoreUpdate(g.score);
              hitAlien = true;
              break;
            }
          }
          if (hitAlien) {
            g.bullets.splice(i, 1);
            continue;
          }

          // UFO hit
          if (g.ufo && g.ufo.active && b.x > g.ufo.x && b.x < g.ufo.x + 36 && b.y < g.ufo.y + 16) {
            g.ufo.active = false;
            sounds.playMarioPowerup();
            g.score += 200;
            setScore(g.score);
            g.bullets.splice(i, 1);
            continue;
          }

          if (b.y < 0) g.bullets.splice(i, 1);
        }

        // Alien movement & march step
        g.alienStepTimer++;
        const aliveAliens = g.aliens.filter(a => a.alive);

        if (aliveAliens.length === 0) {
          // Wave clear
          sounds.playMarioPowerup();
          initGame(wave + 1);
          return;
        }

        // Dynamic frequency as aliens die
        const currentFreq = Math.max(4, Math.floor((aliveAliens.length / 50) * g.alienStepFreq));

        if (g.alienStepTimer >= currentFreq) {
          g.alienStepTimer = 0;
          sounds.playInvaderStep(g.stepSoundIdx++);

          // Check edge collision
          let shiftDown = false;
          for (const a of aliveAliens) {
            if (g.alienDir > 0 && a.x + a.w >= canvas.width - 20) {
              shiftDown = true;
              break;
            } else if (g.alienDir < 0 && a.x <= 20) {
              shiftDown = true;
              break;
            }
          }

          if (shiftDown) {
            g.alienDir = -g.alienDir;
            for (const a of aliveAliens) {
              a.y += 14;
              if (a.y + a.h >= p.y) {
                // Aliens reached bottom!
                sounds.playCrash();
                setGameState('gameover');
                break;
              }
            }
          } else {
            for (const a of aliveAliens) {
              a.x += g.alienDir * 6;
            }
          }

          // Alien shoot
          if (Math.random() < 0.65 && g.alienBullets.length < 3) {
            const randomShooter = aliveAliens[Math.floor(Math.random() * aliveAliens.length)];
            g.alienBullets.push({
              x: randomShooter.x + randomShooter.w / 2,
              y: randomShooter.y + randomShooter.h,
              vy: 4.5
            });
          }
        }

        // UFO logic
        if (!g.ufo && Math.random() < 0.002) {
          g.ufo = { x: -40, y: 45, active: true, speed: 2.2 };
        }
        if (g.ufo && g.ufo.active) {
          g.ufo.x += g.ufo.speed;
          if (g.ufo.x > canvas.width + 40) {
            g.ufo = null;
          }
        }

        // Alien bullets
        for (let i = g.alienBullets.length - 1; i >= 0; i--) {
          const ab = g.alienBullets[i];
          ab.y += ab.vy;

          // Hit shields
          for (let s = g.shields.length - 1; s >= 0; s--) {
            const sh = g.shields[s];
            if (ab.x > sh.x && ab.x < sh.x + 8 && ab.y > sh.y && ab.y < sh.y + 8) {
              sh.hits++;
              if (sh.hits >= 3) g.shields.splice(s, 1);
              g.alienBullets.splice(i, 1);
              break;
            }
          }

          // Hit player
          if (ab.x > p.x && ab.x < p.x + p.w && ab.y > p.y && ab.y < p.y + p.h) {
            sounds.playCrash();
            g.lives--;
            setLives(g.lives);
            g.alienBullets.splice(i, 1);

            if (g.lives <= 0) {
              setGameState('gameover');
            }
            break;
          }

          if (ab.y > canvas.height) g.alienBullets.splice(i, 1);
        }
      }

      // RENDER
      ctx.fillStyle = '#050811';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars in background
      ctx.fillStyle = '#ffffff';
      for (let s = 0; s < 40; s++) {
        const sx = (s * 37) % canvas.width;
        const sy = (s * 53) % canvas.height;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // UFO
      if (g.ufo && g.ufo.active) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.ellipse(g.ufo.x + 18, g.ufo.y + 8, 18, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(g.ufo.x + 10, g.ufo.y + 2, 16, 4);
      }

      // Aliens
      const animFrame = Math.floor(Date.now() / 350) % 2;
      for (const a of g.aliens) {
        if (!a.alive) continue;

        if (a.type === 'squid') {
          ctx.fillStyle = '#ec4899'; // Pink squid
          ctx.fillRect(a.x + 6, a.y + 2, 12, 10);
          ctx.fillRect(a.x + 2, a.y + (animFrame ? 10 : 8), 4, 6);
          ctx.fillRect(a.x + 18, a.y + (animFrame ? 10 : 8), 4, 6);
          ctx.fillStyle = '#000000';
          ctx.fillRect(a.x + 8, a.y + 5, 2, 3);
          ctx.fillRect(a.x + 14, a.y + 5, 2, 3);
        } else if (a.type === 'crab') {
          ctx.fillStyle = '#38bdf8'; // Cyan crab
          ctx.fillRect(a.x + 4, a.y + 4, 16, 8);
          ctx.fillRect(a.x + (animFrame ? 1 : 2), a.y + 10, 4, 5);
          ctx.fillRect(a.x + (animFrame ? 19 : 18), a.y + 10, 4, 5);
          ctx.fillRect(a.x + 2, a.y + 1, 4, 4);
          ctx.fillRect(a.x + 18, a.y + 1, 4, 4);
          ctx.fillStyle = '#000000';
          ctx.fillRect(a.x + 7, a.y + 6, 2, 2);
          ctx.fillRect(a.x + 15, a.y + 6, 2, 2);
        } else {
          ctx.fillStyle = '#22c55e'; // Green octopus
          ctx.fillRect(a.x + 4, a.y + 2, 16, 10);
          ctx.fillRect(a.x + 2, a.y + (animFrame ? 10 : 8), 4, 6);
          ctx.fillRect(a.x + 10, a.y + (animFrame ? 8 : 11), 4, 5);
          ctx.fillRect(a.x + 18, a.y + (animFrame ? 10 : 8), 4, 6);
          ctx.fillStyle = '#000000';
          ctx.fillRect(a.x + 7, a.y + 5, 2, 3);
          ctx.fillRect(a.x + 15, a.y + 5, 2, 3);
        }
      }

      // Shields
      for (const sh of g.shields) {
        ctx.fillStyle = sh.hits === 0 ? '#10b981' : sh.hits === 1 ? '#059669' : '#047857';
        ctx.fillRect(sh.x, sh.y, 8, 8);
      }

      // Player Cannon
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(p.x + 2, p.y + 8, p.w - 4, p.h - 8);
      ctx.fillRect(p.x + p.w / 2 - 2, p.y, 4, 8);
      ctx.fillRect(p.x + 6, p.y + 5, p.w - 12, 4);

      // Player bullets
      ctx.fillStyle = '#fde047';
      for (const b of g.bullets) {
        ctx.fillRect(b.x, b.y, 3, 8);
      }

      // Alien bullets
      ctx.fillStyle = '#f43f5e';
      for (const ab of g.alienBullets) {
        ctx.fillRect(ab.x, ab.y, 3, 7);
      }

      // Top HUD
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 13px monospace';
      ctx.fillText(`SCORE: ${String(g.score).padStart(5, '0')}`, 20, 25);
      ctx.fillText(`WAVE: ${wave}`, 210, 25);
      ctx.fillStyle = '#22c55e';
      ctx.fillText(`SHIPS: ${'▲ '.repeat(g.lives)}`, 370, 25);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, wave]);

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-white select-none overflow-hidden font-sans">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <Crosshair className="w-4 h-4 text-emerald-400" />
          <span className="font-bold tracking-wider text-emerald-400">GALAXY INVADER 1982</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSoundMuted(!soundMuted);
              sounds.enabled = soundMuted;
            }}
            className="p-1 hover:bg-slate-800 rounded text-slate-300"
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => initGame(1)}
            className="flex items-center space-x-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="relative flex-1 flex items-center justify-center bg-black overflow-hidden">
        <canvas
          ref={canvasRef}
          width={480}
          height={480}
          className="max-h-full max-w-full aspect-square object-contain shadow-2xl"
          style={{ imageRendering: 'pixelated' }}
        />

        {gameState === 'menu' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="text-4xl font-black text-emerald-400 tracking-wider mb-1">
              SPACE INVADERS
            </div>
            <div className="text-sky-400 font-mono text-sm tracking-widest mb-6">ARCADE DEFENDER 1982</div>

            <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-4 max-w-xs text-xs text-slate-300 space-y-2 mb-6 text-left">
              <div className="font-bold text-white mb-1">👾 MISSION BRIEF:</div>
              <div>• <span className="text-emerald-400 font-mono">Arrow Left / Right (A / D)</span>: Move Cannon</div>
              <div>• <span className="text-amber-400 font-mono">Space / Up / W</span>: Fire Blaster</div>
              <div>• Take cover behind green bunkers and eliminate all alien rows!</div>
            </div>

            <button
              onClick={() => initGame(1)}
              className="flex items-center space-x-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-lg shadow-lg transition"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>COMMENCE MISSION</span>
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-rose-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="text-4xl font-black text-rose-500 mb-2">BASE DESTROYED!</div>
            <div className="text-slate-200 text-sm mb-6">Final Score: <span className="font-mono text-amber-400 font-bold">{score}</span></div>
            <button
              onClick={() => initGame(1)}
              className="flex items-center space-x-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg shadow-lg active:scale-95 transition"
            >
              <RotateCcw className="w-5 h-5" />
              <span>PLAY AGAIN</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-t border-slate-800 text-slate-300">
        <div className="flex space-x-2">
          <button
            onPointerDown={() => { keysRef.current.left = true; }}
            onPointerUp={() => { keysRef.current.left = false; }}
            onPointerLeave={() => { keysRef.current.left = false; }}
            className="w-12 h-11 bg-slate-800 active:bg-slate-700 rounded-lg flex items-center justify-center shadow"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onPointerDown={() => { keysRef.current.right = true; }}
            onPointerUp={() => { keysRef.current.right = false; }}
            onPointerLeave={() => { keysRef.current.right = false; }}
            className="w-12 h-11 bg-slate-800 active:bg-slate-700 rounded-lg flex items-center justify-center shadow"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-[11px] text-slate-400 hidden sm:block">
          Use <span className="text-slate-200">A / D</span> to move, <span className="text-emerald-300">Space</span> to shoot
        </div>

        <div>
          <button
            onPointerDown={() => { keysRef.current.shoot = true; }}
            onPointerUp={() => { keysRef.current.shoot = false; }}
            onPointerLeave={() => { keysRef.current.shoot = false; }}
            className="w-16 h-11 bg-emerald-600 active:bg-emerald-500 text-white rounded-lg flex items-center justify-center shadow font-bold text-xs"
          >
            FIRE
          </button>
        </div>
      </div>
    </div>
  );
};
