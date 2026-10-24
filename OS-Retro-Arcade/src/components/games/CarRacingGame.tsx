import React, { useEffect, useRef, useState } from 'react';
import { sounds } from '../../utils/audio';
import { Play, RotateCcw, Volume2, VolumeX, Flame, ArrowLeft, ArrowRight, ShieldAlert, Zap } from 'lucide-react';

interface CarRacingGameProps {
  onScoreUpdate?: (score: number) => void;
}

export const CarRacingGame: React.FC<CarRacingGameProps> = ({ onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(80);
  const [distance, setDistance] = useState(0);
  const [nitro, setNitro] = useState(100);
  const [health, setHealth] = useState(100);
  const [soundMuted, setSoundMuted] = useState(false);

  const keysRef = useRef<{ left: boolean; right: boolean; up: boolean; down: boolean; nitro: boolean }>({
    left: false,
    right: false,
    up: false,
    down: false,
    nitro: false
  });

  const gameRef = useRef<{
    player: {
      x: number; // 0 to 400
      y: number;
      w: number;
      h: number;
      targetX: number;
      speed: number;
      maxSpeed: number;
      nitroActive: boolean;
      nitroFuel: number;
      health: number;
      spinTimer: number;
    };
    roadOffset: number;
    traffic: Array<{
      id: number;
      x: number;
      y: number;
      w: number;
      h: number;
      speed: number;
      color: string;
      isPolice?: boolean;
      type: 'car' | 'truck' | 'police';
    }>;
    pickups: Array<{
      id: number;
      x: number;
      y: number;
      type: 'nitro' | 'coin' | 'repair' | 'oil';
      collected: boolean;
    }>;
    particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
      size: number;
    }>;
    distance: number;
    score: number;
    spawnTimer: number;
  }>({
    player: {
      x: 200,
      y: 350,
      w: 36,
      h: 64,
      targetX: 200,
      speed: 80,
      maxSpeed: 210,
      nitroActive: false,
      nitroFuel: 100,
      health: 100,
      spinTimer: 0
    },
    roadOffset: 0,
    traffic: [],
    pickups: [],
    particles: [],
    distance: 0,
    score: 0,
    spawnTimer: 0
  });

  const startRace = () => {
    gameRef.current = {
      player: {
        x: 200,
        y: 350,
        w: 36,
        h: 64,
        targetX: 200,
        speed: 80,
        maxSpeed: 210,
        nitroActive: false,
        nitroFuel: 100,
        health: 100,
        spinTimer: 0
      },
      roadOffset: 0,
      traffic: [
        { id: 1, x: 130, y: 100, w: 34, h: 60, speed: 50, color: '#3b82f6', type: 'car' },
        { id: 2, x: 270, y: -150, w: 40, h: 90, speed: 40, color: '#eab308', type: 'truck' }
      ],
      pickups: [
        { id: 1, x: 200, y: -50, type: 'nitro', collected: false },
        { id: 2, x: 140, y: -300, type: 'coin', collected: false }
      ],
      particles: [],
      distance: 0,
      score: 0,
      spawnTimer: 0
    };

    setScore(0);
    setDistance(0);
    setHealth(100);
    setNitro(100);
    setSpeed(80);
    setGameState('playing');
    sounds.playNitroBoost();
  };

  // Keyboard
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = true;
      if (e.code === 'ArrowUp' || e.code === 'KeyW') keysRef.current.up = true;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') keysRef.current.down = true;
      if (e.code === 'Space' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        keysRef.current.nitro = true;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = false;
      if (e.code === 'ArrowUp' || e.code === 'KeyW') keysRef.current.up = false;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') keysRef.current.down = false;
      if (e.code === 'Space' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        keysRef.current.nitro = false;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // Racing Loop
  useEffect(() => {
    let animId: number;
    let engineSoundTimer = 0;

    const loop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const g = gameRef.current;
      const p = g.player;

      if (gameState === 'playing') {
        // Handle player input
        const steerSpeed = (p.speed / 70) * 4.5;

        if (p.spinTimer > 0) {
          p.spinTimer--;
          p.x += Math.sin(p.spinTimer * 0.5) * 4;
        } else {
          if (keysRef.current.left) {
            p.x -= steerSpeed;
          }
          if (keysRef.current.right) {
            p.x += steerSpeed;
          }
        }

        // Road constraints
        const roadMinX = 70;
        const roadMaxX = 330;
        if (p.x < roadMinX) {
          p.x = roadMinX;
          p.speed = Math.max(50, p.speed - 3);
          sounds.playTireScreech();
        }
        if (p.x > roadMaxX) {
          p.x = roadMaxX;
          p.speed = Math.max(50, p.speed - 3);
          sounds.playTireScreech();
        }

        // Speed calculation
        let targetSpeed = 130;
        if (keysRef.current.up) targetSpeed = p.maxSpeed;
        if (keysRef.current.down) targetSpeed = 60;

        // Nitro
        if (keysRef.current.nitro && p.nitroFuel > 0) {
          targetSpeed = 260;
          p.nitroFuel = Math.max(0, p.nitroFuel - 0.7);
          p.nitroActive = true;
          // Nitro exhaust particles
          g.particles.push({
            x: p.x + (Math.random() - 0.5) * 16,
            y: p.y + p.h,
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * 4 + 6,
            life: 18,
            color: '#38bdf8',
            size: Math.random() * 4 + 3
          });
        } else {
          p.nitroActive = false;
        }

        // Smooth speed transition
        p.speed += (targetSpeed - p.speed) * 0.05;

        // Engine sound throttle
        engineSoundTimer++;
        if (engineSoundTimer % 18 === 0) {
          sounds.playCarEngineRev(p.speed / 260);
        }

        // Distance & score update
        const distanceDelta = p.speed * 0.003;
        g.distance += distanceDelta;
        g.score += Math.floor(distanceDelta * 20);

        setSpeed(Math.floor(p.speed));
        setDistance(Math.floor(g.distance));
        setScore(g.score);
        setNitro(Math.floor(p.nitroFuel));
        if (onScoreUpdate) onScoreUpdate(g.score);

        // Road scroll offset
        g.roadOffset = (g.roadOffset + p.speed * 0.15) % 80;

        // Spawn traffic
        g.spawnTimer++;
        if (g.spawnTimer > 70 - Math.min(40, g.distance * 0.2)) {
          g.spawnTimer = 0;
          const lanes = [95, 165, 235, 305];
          const chosenLane = lanes[Math.floor(Math.random() * lanes.length)];
          const trafficType = Math.random() > 0.3 ? 'car' : Math.random() > 0.5 ? 'truck' : 'police';
          const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
          const color = colors[Math.floor(Math.random() * colors.length)];

          g.traffic.push({
            id: Date.now() + Math.random(),
            x: chosenLane - 18,
            y: -120,
            w: trafficType === 'truck' ? 38 : 34,
            h: trafficType === 'truck' ? 88 : 58,
            speed: trafficType === 'truck' ? 45 : 65 + Math.random() * 25,
            color,
            type: trafficType
          });

          // Also chance of pickup
          if (Math.random() > 0.45) {
            const pickupLanes = [110, 180, 250, 310];
            const pLane = pickupLanes[Math.floor(Math.random() * pickupLanes.length)];
            const pTypes: Array<'nitro' | 'coin' | 'repair' | 'oil'> = ['nitro', 'coin', 'coin', 'repair', 'oil'];
            const pType = pTypes[Math.floor(Math.random() * pTypes.length)];
            g.pickups.push({
              id: Date.now() + Math.random(),
              x: pLane,
              y: -100 - Math.random() * 80,
              type: pType,
              collected: false
            });
          }
        }

        // Update traffic
        for (let i = g.traffic.length - 1; i >= 0; i--) {
          const t = g.traffic[i];
          const relativeSpeed = (p.speed - t.speed) * 0.14;
          t.y += relativeSpeed;

          // Collision with player car
          if (
            p.x < t.x + t.w &&
            p.x + p.w > t.x &&
            p.y < t.y + t.h &&
            p.y + p.h > t.y
          ) {
            // Crash!
            sounds.playCrash();
            p.health -= 35;
            setHealth(Math.max(0, p.health));
            p.speed = Math.max(30, p.speed - 70);
            p.spinTimer = 25;

            // Explosion particles
            for (let k = 0; k < 15; k++) {
              g.particles.push({
                x: p.x + p.w / 2,
                y: p.y + p.h / 2,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 25,
                color: Math.random() > 0.5 ? '#f97316' : '#ef4444',
                size: Math.random() * 5 + 3
              });
            }

            g.traffic.splice(i, 1);

            if (p.health <= 0) {
              setGameState('gameover');
              break;
            }
            continue;
          }

          // Remove offscreen
          if (t.y > 600 || t.y < -300) {
            g.traffic.splice(i, 1);
          }
        }

        // Update pickups
        for (let i = g.pickups.length - 1; i >= 0; i--) {
          const pk = g.pickups[i];
          pk.y += p.speed * 0.14;

          // Pickup collection
          if (!pk.collected && Math.hypot(p.x + p.w / 2 - pk.x, p.y + p.h / 2 - pk.y) < 32) {
            pk.collected = true;

            if (pk.type === 'nitro') {
              sounds.playNitroBoost();
              p.nitroFuel = Math.min(100, p.nitroFuel + 45);
              g.score += 300;
            } else if (pk.type === 'coin') {
              sounds.playMarioCoin();
              g.score += 250;
            } else if (pk.type === 'repair') {
              sounds.playMarioPowerup();
              p.health = Math.min(100, p.health + 30);
              setHealth(p.health);
            } else if (pk.type === 'oil') {
              sounds.playTireScreech();
              p.spinTimer = 35;
              p.speed = Math.max(40, p.speed - 30);
            }

            g.pickups.splice(i, 1);
          } else if (pk.y > 550) {
            g.pickups.splice(i, 1);
          }
        }

        // Particles
        for (let i = g.particles.length - 1; i >= 0; i--) {
          const pt = g.particles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life--;
          if (pt.life <= 0) g.particles.splice(i, 1);
        }
      }

      // RENDER
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grass / road sides
      ctx.fillStyle = '#1e3a1e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Road shoulder
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(48, 0, 16, canvas.height);
      ctx.fillRect(336, 0, 16, canvas.height);

      // Red/white kerb stripes
      ctx.fillStyle = '#ffffff';
      for (let y = (g.roadOffset * 2) % 40 - 40; y < canvas.height; y += 40) {
        ctx.fillRect(48, y, 16, 20);
        ctx.fillRect(336, y, 16, 20);
      }

      // Asphalt highway
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(64, 0, 272, canvas.height);

      // Dashed lane lines
      ctx.fillStyle = '#facc15';
      ctx.fillRect(198, 0, 4, canvas.height); // Center line

      ctx.fillStyle = '#ffffff';
      for (let y = (g.roadOffset * 1.5) % 60 - 60; y < canvas.height; y += 60) {
        // Left lane marker
        ctx.fillRect(132, y, 3, 30);
        // Right lane marker
        ctx.fillRect(266, y, 3, 30);
      }

      // Speed lines on borders when going fast
      if (p.speed > 180) {
        ctx.strokeStyle = p.nitroActive ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 6; i++) {
          const lx = 20 + Math.random() * 25;
          const rx = 355 + Math.random() * 25;
          const sy = Math.random() * canvas.height;
          ctx.beginPath();
          ctx.moveTo(lx, sy);
          ctx.lineTo(lx, sy + 40);
          ctx.moveTo(rx, sy);
          ctx.lineTo(rx, sy + 40);
          ctx.stroke();
        }
      }

      // Render Pickups
      for (const pk of g.pickups) {
        if (pk.type === 'nitro') {
          // Blue nitro bottle
          ctx.fillStyle = '#0284c7';
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(pk.x - 8, pk.y - 12, 16, 24, 4) : ctx.fillRect(pk.x - 8, pk.y - 12, 16, 24);
          ctx.fill();
          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 10px sans-serif';
          ctx.fillText('N₂O', pk.x - 9, pk.y + 4);
        } else if (pk.type === 'coin') {
          // Gold coin
          ctx.fillStyle = '#eab308';
          ctx.beginPath();
          ctx.arc(pk.x, pk.y, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 11px monospace';
          ctx.fillText('$', pk.x - 4, pk.y + 4);
        } else if (pk.type === 'repair') {
          // Green wrench/repair kit
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(pk.x, pk.y, 11, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px monospace';
          ctx.fillText('+', pk.x - 4, pk.y + 4);
        } else if (pk.type === 'oil') {
          // Oil slick
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.ellipse(pk.x, pk.y, 18, 10, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Render Traffic Cars
      for (const t of g.traffic) {
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(t.x + 3, t.y + 3, t.w, t.h);

        // Body
        ctx.fillStyle = t.color;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(t.x, t.y, t.w, t.h, 6);
        } else {
          ctx.fillRect(t.x, t.y, t.w, t.h);
        }
        ctx.fill();

        // Windshields
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(t.x + 4, t.y + 12, t.w - 8, 10); // Front
        ctx.fillRect(t.x + 4, t.y + t.h - 16, t.w - 8, 8); // Rear

        // Headlights / taillights
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(t.x + 2, t.y + 1, 6, 4);
        ctx.fillRect(t.x + t.w - 8, t.y + 1, 6, 4);

        ctx.fillStyle = '#ef4444';
        ctx.fillRect(t.x + 2, t.y + t.h - 5, 6, 4);
        ctx.fillRect(t.x + t.w - 8, t.y + t.h - 5, 6, 4);

        // Police flashing light
        if (t.type === 'police') {
          const flash = Math.floor(Date.now() / 120) % 2;
          ctx.fillStyle = flash ? '#ef4444' : '#3b82f6';
          ctx.fillRect(t.x + t.w / 2 - 6, t.y + 24, 12, 6);
        }
      }

      // Render Player Car (Red Formula / Supercar)
      ctx.save();
      const px = p.x;
      const py = p.y;
      const pw = p.w;
      const ph = p.h;

      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(px + 4, py + 4, pw, ph);

      // Car main chassis
      ctx.fillStyle = '#dc2626'; // Red Sports Car
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(px, py, pw, ph, 8);
        ctx.fill();
      } else {
        ctx.fillRect(px, py, pw, ph);
      }

      // Racing stripe
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px + pw / 2 - 2, py, 4, ph);

      // Windshield & Roof
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(px + 4, py + 14, pw - 8, 14); // Windshield
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(px + 4, py + 28, pw - 8, 16); // Roof
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(px + 5, py + 44, pw - 10, 8); // Rear window

      // Front Headlights beam
      ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
      ctx.beginPath();
      ctx.moveTo(px + 4, py);
      ctx.lineTo(px - 15, py - 90);
      ctx.lineTo(px + pw + 15, py - 90);
      ctx.lineTo(px + pw - 4, py);
      ctx.fill();

      // Taillights
      ctx.fillStyle = keysRef.current.down ? '#ff0000' : '#ef4444';
      ctx.fillRect(px + 3, py + ph - 4, 7, 4);
      ctx.fillRect(px + pw - 10, py + ph - 4, 7, 4);

      // Nitro glow flame
      if (p.nitroActive) {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(px + pw / 2 - 8, py + ph);
        ctx.lineTo(px + pw / 2 + 8, py + ph);
        ctx.lineTo(px + pw / 2, py + ph + 24 + Math.random() * 10);
        ctx.fill();
      }

      ctx.restore();

      // Render Particles
      for (const pt of g.particles) {
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // HUD Dashboard Overlay
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(0, 0, canvas.width, 48);

      // Speedometer
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(`${Math.floor(p.speed)}`, 14, 28);
      ctx.font = '10px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('KM/H', 58, 28);

      // Distance
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`DIST: ${Math.floor(g.distance)}M`, 100, 28);

      // Nitro Gauge Bar
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(200, 18, 60, 12);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(200, 18, (p.nitroFuel / 100) * 60, 12);
      ctx.strokeStyle = '#0f172a';
      ctx.strokeRect(200, 18, 60, 12);
      ctx.font = '9px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('NITRO', 214, 27);

      // Health Bar
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(275, 18, 50, 12);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(275, 18, (Math.max(0, p.health) / 100) * 50, 12);
      ctx.strokeStyle = '#0f172a';
      ctx.strokeRect(275, 18, 50, 12);
      ctx.font = '9px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('HP', 293, 27);

      // Score
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`${g.score}`, 340, 28);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [gameState]);

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-white select-none overflow-hidden font-sans">
      {/* Title bar / settings */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
          <span className="font-bold tracking-wider text-orange-400">TURBO NITRO RACER 1989</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSoundMuted(!soundMuted);
              sounds.enabled = soundMuted;
            }}
            className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            onClick={startRace}
            className="flex items-center space-x-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="relative flex-1 flex items-center justify-center bg-black overflow-hidden">
        <canvas
          ref={canvasRef}
          width={400}
          height={480}
          className="max-h-full max-w-full aspect-[400/480] object-contain shadow-2xl"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Start Overlay */}
        {gameState === 'menu' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 mb-1">
              TURBO NITRO
            </div>
            <div className="text-sky-400 font-mono text-sm tracking-widest mb-6">HIGHWAY RADICAL 80S</div>

            <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-4 max-w-xs text-xs text-slate-300 space-y-2 mb-6 text-left">
              <div className="font-bold text-white mb-1">🏎️ RACING CONTROLS:</div>
              <div>• <span className="text-amber-400 font-mono">Arrow Left / Right (A / D)</span>: Steer</div>
              <div>• <span className="text-amber-400 font-mono">Arrow Up / W</span>: Accelerate</div>
              <div>• <span className="text-amber-400 font-mono">Arrow Down / S</span>: Brake</div>
              <div>• <span className="text-sky-400 font-mono">Space / Shift</span>: NITRO BOOST! 🔥</div>
              <div>• Grab <span className="text-sky-400 font-bold">N₂O</span>, <span className="text-amber-400 font-bold">Coins</span>, and avoid <span className="text-red-400 font-bold">Traffic & Oil</span>!</div>
            </div>

            <button
              onClick={startRace}
              className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 active:scale-95 text-white font-bold rounded-lg shadow-lg transition"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>START RACE</span>
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-red-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
            <div className="text-4xl font-black text-red-500 mb-2">TOTAL CRASH!</div>
            <div className="text-slate-300 text-sm mb-1">Total Distance: <span className="font-mono text-sky-400 font-bold">{distance}m</span></div>
            <div className="text-slate-300 text-sm mb-6">Final Score: <span className="font-mono text-amber-400 font-bold">{score}</span></div>
            <button
              onClick={startRace}
              className="flex items-center space-x-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg shadow-lg active:scale-95 transition"
            >
              <RotateCcw className="w-5 h-5" />
              <span>RACE AGAIN</span>
            </button>
          </div>
        )}
      </div>

      {/* On-screen touch / mouse controls */}
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
          Use Keyboard <span className="text-slate-200">A/D</span> or Arrows to steer, <span className="text-sky-300">Space</span> for Nitro
        </div>

        <div className="flex space-x-2">
          <button
            onPointerDown={() => { keysRef.current.down = true; }}
            onPointerUp={() => { keysRef.current.down = false; }}
            onPointerLeave={() => { keysRef.current.down = false; }}
            className="w-11 h-11 bg-rose-900/80 active:bg-rose-800 text-white rounded-lg flex items-center justify-center shadow text-xs font-bold"
          >
            <ShieldAlert className="w-5 h-5" />
          </button>
          <button
            onPointerDown={() => { keysRef.current.nitro = true; sounds.playNitroBoost(); }}
            onPointerUp={() => { keysRef.current.nitro = false; }}
            onPointerLeave={() => { keysRef.current.nitro = false; }}
            className="w-14 h-11 bg-sky-600 active:bg-sky-500 text-white rounded-lg flex items-center justify-center shadow font-bold text-xs"
          >
            <Zap className="w-4 h-4 mr-1 fill-current" />
            <span>NOS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
