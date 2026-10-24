import React, { useEffect, useRef, useState } from 'react';
import { sounds } from '../../utils/audio';
import { Play, RotateCcw, Volume2, VolumeX, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

interface SnakeGameProps {
  onScoreUpdate?: (score: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [soundMuted, setSoundMuted] = useState(false);
  const [crtMode, setCrtMode] = useState(false);

  const dirRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 });
  const nextDirRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 });

  const gameRef = useRef<{
    snake: Array<{ x: number; y: number }>;
    food: { x: number; y: number; type: 'apple' | 'golden'; timer: number };
    score: number;
    speed: number;
  }>({
    snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }],
    food: { x: 15, y: 10, type: 'apple', timer: 0 },
    score: 0,
    speed: 110
  });

  const spawnFood = (snake: Array<{ x: number; y: number }>) => {
    let fx = Math.floor(Math.random() * 20);
    let fy = Math.floor(Math.random() * 20);
    while (snake.some(s => s.x === fx && s.y === fy)) {
      fx = Math.floor(Math.random() * 20);
      fy = Math.floor(Math.random() * 20);
    }
    const isGolden = Math.random() < 0.25;
    return {
      x: fx,
      y: fy,
      type: isGolden ? ('golden' as const) : ('apple' as const),
      timer: isGolden ? 60 : 0
    };
  };

  const startSnake = () => {
    const initialSnake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    gameRef.current = {
      snake: initialSnake,
      food: spawnFood(initialSnake),
      score: 0,
      speed: 110
    };
    setScore(0);
    setGameState('playing');
    sounds.playSnakeEat();
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
      const cur = dirRef.current;
      if ((e.code === 'ArrowUp' || e.code === 'KeyW') && cur.y === 0) nextDirRef.current = { x: 0, y: -1 };
      if ((e.code === 'ArrowDown' || e.code === 'KeyS') && cur.y === 0) nextDirRef.current = { x: 0, y: 1 };
      if ((e.code === 'ArrowLeft' || e.code === 'KeyA') && cur.x === 0) nextDirRef.current = { x: -1, y: 0 };
      if ((e.code === 'ArrowRight' || e.code === 'KeyD') && cur.x === 0) nextDirRef.current = { x: 1, y: 0 };
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;

    let intervalId: number;

    const tick = () => {
      const g = gameRef.current;
      dirRef.current = nextDirRef.current;
      const head = { x: g.snake[0].x + dirRef.current.x, y: g.snake[0].y + dirRef.current.y };

      // Wall collision
      if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
        sounds.playCrash();
        setGameState('gameover');
        return;
      }

      // Self collision
      if (g.snake.some(s => s.x === head.x && s.y === head.y)) {
        sounds.playCrash();
        setGameState('gameover');
        return;
      }

      const newSnake = [head, ...g.snake];

      // Food check
      if (head.x === g.food.x && head.y === g.food.y) {
        sounds.playSnakeEat();
        const pts = g.food.type === 'golden' ? 250 : 100;
        g.score += pts;
        setScore(g.score);
        if (g.score > bestScore) setBestScore(g.score);
        if (onScoreUpdate) onScoreUpdate(g.score);

        // Slightly increase speed
        g.speed = Math.max(60, g.speed - 2);
        g.food = spawnFood(newSnake);
      } else {
        newSnake.pop();
      }

      g.snake = newSnake;

      // Render canvas
      render();
    };

    intervalId = window.setInterval(tick, gameRef.current.speed);
    return () => clearInterval(intervalId);
  }, [gameState, bestScore]);

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const g = gameRef.current;
    const cellSize = 20; // 20x20 cells = 400x400

    ctx.fillStyle = crtMode ? '#021a08' : '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = crtMode ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 20; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Food
    const fx = g.food.x * cellSize;
    const fy = g.food.y * cellSize;
    if (g.food.type === 'golden') {
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(fx + 10, fy + 10, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(fx + 7, fy + 4, 3, 3);
    } else {
      ctx.fillStyle = crtMode ? '#4ade80' : '#ef4444';
      ctx.beginPath();
      ctx.arc(fx + 10, fy + 10, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(fx + 9, fy + 2, 2, 4); // Stem
    }

    // Snake body
    g.snake.forEach((s, idx) => {
      const sx = s.x * cellSize;
      const sy = s.y * cellSize;

      if (idx === 0) {
        // Head
        ctx.fillStyle = crtMode ? '#86efac' : '#38bdf8';
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(sx + 1, sy + 1, cellSize - 2, cellSize - 2, 5);
        } else {
          ctx.fillRect(sx + 1, sy + 1, cellSize - 2, cellSize - 2);
        }
        ctx.fill();
        // Eyes
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(sx + 5, sy + 5, 3, 3);
        ctx.fillRect(sx + 12, sy + 5, 3, 3);
      } else {
        // Body segment
        ctx.fillStyle = crtMode ? '#22c55e' : idx % 2 === 0 ? '#0284c7' : '#0369a1';
        ctx.fillRect(sx + 2, sy + 2, cellSize - 4, cellSize - 4);
      }
    });

    // Scanlines filter
    if (crtMode) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.fillRect(0, y, canvas.width, 2);
      }
    }
  };

  useEffect(() => {
    render();
  }, [crtMode]);

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-white select-none overflow-hidden font-sans">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold tracking-wider text-emerald-400">NEON SNAKE 3310</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCrtMode(!crtMode)}
            className={`px-2 py-0.5 rounded text-[11px] font-mono border ${crtMode ? 'bg-emerald-950 border-emerald-600 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
          >
            CRT: {crtMode ? 'ON' : 'OFF'}
          </button>
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
            onClick={startSnake}
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
          width={400}
          height={400}
          className="max-h-full max-w-full aspect-square object-contain shadow-2xl"
          style={{ imageRendering: 'pixelated' }}
        />

        {gameState === 'menu' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="text-4xl font-black text-emerald-400 mb-1">NEON SNAKE</div>
            <div className="text-amber-400 font-mono text-sm tracking-widest mb-6">NOKIA 3310 REMASTERED</div>

            <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-4 max-w-xs text-xs text-slate-300 space-y-2 mb-6 text-left">
              <div>• Control snake with <span className="text-emerald-400 font-mono">Arrow Keys / WASD</span></div>
              <div>• Eat red apples (<span className="text-red-400 font-bold">+100</span>) and rare golden fruit (<span className="text-amber-400 font-bold">+250</span>)</div>
              <div>• Avoid walls and don't bite your tail!</div>
            </div>

            <button
              onClick={startSnake}
              className="flex items-center space-x-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-lg shadow-lg transition"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>START PLAYING</span>
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-rose-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="text-4xl font-black text-rose-500 mb-2">GAME OVER</div>
            <div className="text-slate-200 text-sm mb-6">Final Score: <span className="font-mono text-amber-400 font-bold">{score}</span></div>
            <button
              onClick={startSnake}
              className="flex items-center space-x-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg active:scale-95 transition"
            >
              <RotateCcw className="w-5 h-5" />
              <span>PLAY AGAIN</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-t border-slate-800 text-slate-300">
        <div className="flex flex-col items-center">
          <button
            onClick={() => { if (dirRef.current.y === 0) nextDirRef.current = { x: 0, y: -1 }; }}
            className="w-10 h-8 bg-slate-800 active:bg-slate-700 rounded flex items-center justify-center mb-1"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <div className="flex space-x-2">
            <button
              onClick={() => { if (dirRef.current.x === 0) nextDirRef.current = { x: -1, y: 0 }; }}
              className="w-10 h-8 bg-slate-800 active:bg-slate-700 rounded flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => { if (dirRef.current.y === 0) nextDirRef.current = { x: 0, y: 1 }; }}
              className="w-10 h-8 bg-slate-800 active:bg-slate-700 rounded flex items-center justify-center"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => { if (dirRef.current.x === 0) nextDirRef.current = { x: 1, y: 0 }; }}
              className="w-10 h-8 bg-slate-800 active:bg-slate-700 rounded flex items-center justify-center"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400">Score: <span className="font-mono text-amber-400 font-bold">{score}</span></div>
          <div className="text-xs text-slate-400">Best: <span className="font-mono text-emerald-400 font-bold">{bestScore}</span></div>
        </div>
      </div>
    </div>
  );
};
