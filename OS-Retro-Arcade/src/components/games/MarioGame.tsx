import React, { useEffect, useRef, useState } from 'react';
import { sounds } from '../../utils/audio';
import { Play, RotateCcw, Volume2, VolumeX, ArrowLeft, ArrowRight, ArrowUp, Zap } from 'lucide-react';

interface MarioGameProps {
  onScoreUpdate?: (score: number) => void;
}

export const MarioGame: React.FC<MarioGameProps> = ({ onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover' | 'victory'>('menu');
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [lives, setLives] = useState(3);
  const [time, setTime] = useState(400);
  const [isSuper, setIsSuper] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);

  // Key tracking
  const keysRef = useRef<{ left: boolean; right: boolean; jump: boolean; run: boolean }>({
    left: false,
    right: false,
    jump: false,
    run: false
  });

  // Game internal state ref
  const gameRef = useRef<{
    player: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      w: number;
      h: number;
      grounded: boolean;
      facing: 'left' | 'right';
      animTimer: number;
      isSuper: boolean;
      invulnerable: number;
    };
    cameraX: number;
    blocks: Array<{ x: number; y: number; w: number; h: number; type: 'ground' | 'brick' | 'question' | 'pipe' | 'pipe-top' | 'block' | 'empty'; content?: 'coin' | 'mushroom'; hit?: boolean; bounceY?: number }>;
    coinsList: Array<{ x: number; y: number; collected: boolean; anim: number }>;
    mushrooms: Array<{ x: number; y: number; vx: number; vy: number; collected: boolean }>;
    enemies: Array<{ x: number; y: number; vx: number; vy: number; type: 'goomba'; alive: boolean; squishedTimer: number }>;
    particles: Array<{ x: number; y: number; vx: number; vy: number; life: number; color: string }>;
    floatingTexts: Array<{ text: string; x: number; y: number; life: number; color: string }>;
    flag: { x: number; y: number; poleHeight: number; flagY: number; reached: boolean };
    score: number;
    coins: number;
    lives: number;
    timeLeft: number;
  }>({
    player: { x: 80, y: 300, vx: 0, vy: 0, w: 24, h: 32, grounded: false, facing: 'right', animTimer: 0, isSuper: false, invulnerable: 0 },
    cameraX: 0,
    blocks: [],
    coinsList: [],
    mushrooms: [],
    enemies: [],
    particles: [],
    floatingTexts: [],
    flag: { x: 2600, y: 120, poleHeight: 280, flagY: 130, reached: false },
    score: 0,
    coins: 0,
    lives: 3,
    timeLeft: 400
  });

  const initLevel = () => {
    const blocks: typeof gameRef.current.blocks = [];
    const coinsList: typeof gameRef.current.coinsList = [];
    const enemies: typeof gameRef.current.enemies = [];

    // Ground segments with gaps
    for (let x = 0; x < 2800; x += 32) {
      // Create holes
      if ((x >= 800 && x <= 896) || (x >= 1400 && x <= 1520) || (x >= 2100 && x <= 2200)) {
        continue;
      }
      blocks.push({ x, y: 384, w: 32, h: 32, type: 'ground' });
      blocks.push({ x, y: 416, w: 32, h: 32, type: 'ground' });
    }

    // Pipes
    const pipeHeights = [
      { x: 300, h: 64 },
      { x: 550, h: 96 },
      { x: 1050, h: 96 },
      { x: 1750, h: 128 },
      { x: 2350, h: 64 },
    ];
    pipeHeights.forEach(p => {
      blocks.push({ x: p.x, y: 384 - p.h, w: 48, h: 24, type: 'pipe-top' });
      blocks.push({ x: p.x + 4, y: 384 - p.h + 24, w: 40, h: p.h - 24, type: 'pipe' });
    });

    // Mystery and brick blocks
    const structures: Array<{
      x: number;
      y: number;
      w?: number;
      h?: number;
      type: 'ground' | 'brick' | 'question' | 'pipe' | 'pipe-top' | 'block' | 'empty';
      content?: 'coin' | 'mushroom';
    }> = [
      // Row 1
      { x: 200, y: 270, type: 'question', content: 'coin' as const },
      { x: 232, y: 270, type: 'brick' as const },
      { x: 264, y: 270, type: 'question', content: 'mushroom' as const },
      { x: 296, y: 270, type: 'brick' as const },
      { x: 328, y: 270, type: 'question', content: 'coin' as const },

      // High coins
      { x: 400, y: 220, type: 'question', content: 'coin' as const },
      { x: 680, y: 270, type: 'brick' as const },
      { x: 712, y: 270, type: 'question', content: 'coin' as const },
      { x: 744, y: 270, type: 'brick' as const },
      { x: 776, y: 270, type: 'question', content: 'coin' as const },

      // Floating island
      { x: 1180, y: 240, type: 'brick' as const },
      { x: 1212, y: 240, type: 'brick' as const },
      { x: 1244, y: 240, type: 'question', content: 'coin' as const },
      { x: 1276, y: 240, type: 'brick' as const },
      { x: 1308, y: 240, type: 'brick' as const },

      // Staircase to end
      { x: 2400, y: 352, w: 32, h: 32, type: 'block' as const },
      { x: 2432, y: 352, w: 32, h: 32, type: 'block' as const },
      { x: 2432, y: 320, w: 32, h: 32, type: 'block' as const },
      { x: 2464, y: 352, w: 32, h: 32, type: 'block' as const },
      { x: 2464, y: 320, w: 32, h: 32, type: 'block' as const },
      { x: 2464, y: 288, w: 32, h: 32, type: 'block' as const },
      { x: 2496, y: 352, w: 32, h: 32, type: 'block' as const },
      { x: 2496, y: 320, w: 32, h: 32, type: 'block' as const },
      { x: 2496, y: 288, w: 32, h: 32, type: 'block' as const },
      { x: 2496, y: 256, w: 32, h: 32, type: 'block' as const },
    ];

    structures.forEach(s => {
      blocks.push({
        x: s.x,
        y: s.y,
        w: s.w || 32,
        h: s.h || 32,
        type: s.type,
        content: s.content,
        hit: false,
        bounceY: 0
      });
    });

    // Loose coins floating
    const coinLocations = [
      { x: 420, y: 340 }, { x: 450, y: 340 }, { x: 480, y: 340 },
      { x: 950, y: 310 }, { x: 980, y: 280 }, { x: 1010, y: 310 },
      { x: 1600, y: 340 }, { x: 1640, y: 340 }, { x: 1680, y: 340 }
    ];
    coinLocations.forEach(c => coinsList.push({ x: c.x, y: c.y, collected: false, anim: 0 }));

    // Goombas
    const goombaSpawns = [380, 480, 680, 950, 1150, 1340, 1650, 1850, 2000, 2260];
    goombaSpawns.forEach(gx => {
      enemies.push({
        x: gx,
        y: 356,
        vx: -1.2,
        vy: 0,
        type: 'goomba',
        alive: true,
        squishedTimer: 0
      });
    });

    gameRef.current = {
      player: {
        x: 80,
        y: 320,
        vx: 0,
        vy: 0,
        w: 22,
        h: 30,
        grounded: false,
        facing: 'right',
        animTimer: 0,
        isSuper: false,
        invulnerable: 0
      },
      cameraX: 0,
      blocks,
      coinsList,
      mushrooms: [],
      enemies,
      particles: [],
      floatingTexts: [],
      flag: { x: 2560, y: 104, poleHeight: 280, flagY: 114, reached: false },
      score: 0,
      coins: 0,
      lives: 3,
      timeLeft: 400
    };

    setScore(0);
    setCoins(0);
    setIsSuper(false);
    setLives(3);
    setTime(400);
  };

  const startGame = () => {
    initLevel();
    setGameState('playing');
    sounds.playMarioCoin();
  };

  // Keyboard handlers
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = true;
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
        if (!keysRef.current.jump && gameRef.current.player.grounded) {
          sounds.playMarioJump();
        }
        keysRef.current.jump = true;
      }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyJ') {
        keysRef.current.run = true;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = false;
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') keysRef.current.jump = false;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyJ') keysRef.current.run = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // Main game loop
  useEffect(() => {
    let animationId: number;
    let timerInterval: number;

    if (gameState === 'playing') {
      timerInterval = window.setInterval(() => {
        if (gameRef.current.timeLeft > 0 && !gameRef.current.flag.reached) {
          gameRef.current.timeLeft -= 1;
          setTime(gameRef.current.timeLeft);
          if (gameRef.current.timeLeft <= 0) {
            handlePlayerDeath();
          }
        }
      }, 1000);
    }

    const handlePlayerDeath = () => {
      sounds.playCrash();
      const currentLives = gameRef.current.lives - 1;
      gameRef.current.lives = currentLives;
      setLives(currentLives);

      if (currentLives <= 0) {
        setGameState('gameover');
      } else {
        // Respawn
        gameRef.current.player.x = Math.max(80, gameRef.current.cameraX - 100);
        gameRef.current.player.y = 200;
        gameRef.current.player.vx = 0;
        gameRef.current.player.vy = 0;
        gameRef.current.player.isSuper = false;
        gameRef.current.player.h = 30;
        setIsSuper(false);
      }
    };

    const loop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const g = gameRef.current;
      const p = g.player;

      if (gameState === 'playing') {
        // 1. UPDATE PLAYER PHYSICS
        const maxSpeed = keysRef.current.run ? 4.8 : 3.2;
        const accel = 0.35;
        const friction = 0.84;
        const gravity = 0.58;

        if (keysRef.current.left) {
          p.vx -= accel;
          p.facing = 'left';
        } else if (keysRef.current.right) {
          p.vx += accel;
          p.facing = 'right';
        } else {
          p.vx *= friction;
        }

        // Speed clamping
        if (p.vx > maxSpeed) p.vx = maxSpeed;
        if (p.vx < -maxSpeed) p.vx = -maxSpeed;
        if (Math.abs(p.vx) < 0.05) p.vx = 0;

        // Jump physics
        if (keysRef.current.jump && p.grounded) {
          p.vy = -12.2;
          p.grounded = false;
        }

        p.vy += gravity;
        if (p.vy > 12) p.vy = 12;

        // Animate
        if (Math.abs(p.vx) > 0.1) {
          p.animTimer += Math.abs(p.vx) * 0.15;
        } else {
          p.animTimer = 0;
        }

        if (p.invulnerable > 0) p.invulnerable--;

        // Horizontal movement & collision
        p.x += p.vx;
        if (p.x < g.cameraX) p.x = g.cameraX;

        // Collision with blocks (Horizontal)
        for (const b of g.blocks) {
          if (
            p.x + p.w > b.x &&
            p.x < b.x + b.w &&
            p.y + p.h > b.y &&
            p.y < b.y + b.h
          ) {
            if (p.vx > 0) {
              p.x = b.x - p.w;
              p.vx = 0;
            } else if (p.vx < 0) {
              p.x = b.x + b.w;
              p.vx = 0;
            }
          }
        }

        // Vertical movement & collision
        p.y += p.vy;
        p.grounded = false;

        for (const b of g.blocks) {
          if (
            p.x + p.w > b.x &&
            p.x < b.x + b.w &&
            p.y + p.h > b.y &&
            p.y < b.y + b.h
          ) {
            // Landing on top of block
            if (p.vy > 0 && p.y + p.h - p.vy <= b.y + 4) {
              p.y = b.y - p.h;
              p.vy = 0;
              p.grounded = true;
            }
            // Hitting block from below
            else if (p.vy < 0 && p.y - p.vy >= b.y + b.h - 8) {
              p.y = b.y + b.h;
              p.vy = 1;

              // Hit block interaction
              if (b.type === 'question' && !b.hit) {
                b.hit = true;
                b.type = 'empty';
                b.bounceY = -8;

                if (b.content === 'coin') {
                  sounds.playMarioCoin();
                  g.coins += 1;
                  g.score += 200;
                  setCoins(g.coins);
                  setScore(g.score);
                  if (onScoreUpdate) onScoreUpdate(g.score);
                  g.floatingTexts.push({ text: '+200', x: b.x, y: b.y - 20, life: 30, color: '#facc15' });
                } else if (b.content === 'mushroom') {
                  sounds.playMarioPowerup();
                  g.mushrooms.push({ x: b.x, y: b.y - 24, vx: 1.5, vy: -3, collected: false });
                }
              } else if (b.type === 'brick') {
                sounds.playMarioBump();
                b.bounceY = -6;
                if (p.isSuper) {
                  // Break brick particles
                  b.type = 'empty';
                  g.score += 50;
                  setScore(g.score);
                  for (let i = 0; i < 4; i++) {
                    g.particles.push({
                      x: b.x + 16,
                      y: b.y + 16,
                      vx: (Math.random() - 0.5) * 6,
                      vy: -Math.random() * 5 - 2,
                      life: 30,
                      color: '#b45309'
                    });
                  }
                }
              }
            }
          }
        }

        // Fall into abyss
        if (p.y > 450) {
          handlePlayerDeath();
        }

        // Camera follow
        const targetCamX = p.x - 220;
        if (targetCamX > g.cameraX) {
          g.cameraX += (targetCamX - g.cameraX) * 0.12;
        }

        // Block bounce animation decay
        for (const b of g.blocks) {
          if (b.bounceY && b.bounceY < 0) {
            b.bounceY += 1;
          }
        }

        // Coin pickups
        for (const c of g.coinsList) {
          if (!c.collected && Math.hypot(p.x + p.w / 2 - c.x, p.y + p.h / 2 - c.y) < 22) {
            c.collected = true;
            sounds.playMarioCoin();
            g.coins += 1;
            g.score += 100;
            setCoins(g.coins);
            setScore(g.score);
            if (onScoreUpdate) onScoreUpdate(g.score);
            g.floatingTexts.push({ text: '+100', x: c.x, y: c.y - 15, life: 30, color: '#fbbf24' });
          }
        }

        // Mushrooms logic
        for (const m of g.mushrooms) {
          if (m.collected) continue;
          m.vy += 0.4;
          m.x += m.vx;
          m.y += m.vy;

          // Collision with ground/blocks
          for (const b of g.blocks) {
            if (m.x + 20 > b.x && m.x < b.x + b.w && m.y + 20 > b.y && m.y < b.y + b.h) {
              if (m.vy > 0) {
                m.y = b.y - 20;
                m.vy = 0;
              } else {
                m.vx = -m.vx;
              }
            }
          }

          // Player touch mushroom
          if (
            p.x + p.w > m.x &&
            p.x < m.x + 20 &&
            p.y + p.h > m.y &&
            p.y < m.y + 20
          ) {
            m.collected = true;
            sounds.playMarioPowerup();
            p.isSuper = true;
            p.h = 42;
            p.y -= 12;
            setIsSuper(true);
            g.score += 1000;
            setScore(g.score);
            g.floatingTexts.push({ text: 'SUPER! +1000', x: p.x, y: p.y - 25, life: 40, color: '#10b981' });
          }
        }

        // Enemies update
        for (const e of g.enemies) {
          if (!e.alive) {
            if (e.squishedTimer > 0) e.squishedTimer--;
            continue;
          }

          // Move Goomba
          e.x += e.vx;

          // Reverse at obstacles
          for (const b of g.blocks) {
            if (b.type !== 'empty' && e.x + 24 > b.x && e.x < b.x + b.w && e.y + 24 > b.y && e.y < b.y + b.h) {
              e.vx = -e.vx;
              break;
            }
          }

          // Player collision with enemy
          if (
            p.x + p.w > e.x &&
            p.x < e.x + 24 &&
            p.y + p.h > e.y &&
            p.y < e.y + 24
          ) {
            // Check if player landed on top (stomp!)
            if (p.vy > 0 && p.y + p.h - p.vy <= e.y + 12) {
              e.alive = false;
              e.squishedTimer = 30;
              p.vy = -8.5; // bounce
              sounds.playMarioStomp();
              g.score += 200;
              setScore(g.score);
              if (onScoreUpdate) onScoreUpdate(g.score);
              g.floatingTexts.push({ text: '+200', x: e.x, y: e.y - 15, life: 30, color: '#ffffff' });
            } else if (p.invulnerable <= 0) {
              // Hurt player
              if (p.isSuper) {
                p.isSuper = false;
                p.h = 30;
                p.invulnerable = 60;
                setIsSuper(false);
                sounds.playCrash();
              } else {
                handlePlayerDeath();
              }
            }
          }
        }

        // Flag pole detection (Level clear!)
        if (!g.flag.reached && p.x + p.w >= g.flag.x) {
          g.flag.reached = true;
          sounds.playMarioCoin();
          sounds.playMarioPowerup();
          g.score += 2500 + g.timeLeft * 10;
          setScore(g.score);
          if (onScoreUpdate) onScoreUpdate(g.score);
          setTimeout(() => {
            setGameState('victory');
          }, 2000);
        }

        // Flag sliding down
        if (g.flag.reached && g.flag.flagY < 350) {
          g.flag.flagY += 4;
        }

        // Particles decay
        for (let i = g.particles.length - 1; i >= 0; i--) {
          const pt = g.particles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.vy += 0.3;
          pt.life--;
          if (pt.life <= 0) g.particles.splice(i, 1);
        }

        // Floating texts decay
        for (let i = g.floatingTexts.length - 1; i >= 0; i--) {
          const ft = g.floatingTexts[i];
          ft.y -= 0.6;
          ft.life--;
          if (ft.life <= 0) g.floatingTexts.splice(i, 1);
        }
      }

      // 2. RENDER GRAPHICS
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, '#5c94fc');
      skyGrad.addColorStop(1, '#92bdfc');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Parallax Background Hills and Clouds
      ctx.save();
      const cam = g.cameraX;

      // Clouds
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 15; i++) {
        const cx = (i * 240) - (cam * 0.3) % 4000;
        const cy = 60 + (i % 3) * 35;
        // Cloud puffs
        ctx.beginPath();
        ctx.arc(cx, cy, 18, 0, Math.PI * 2);
        ctx.arc(cx + 18, cy - 6, 22, 0, Math.PI * 2);
        ctx.arc(cx + 38, cy, 18, 0, Math.PI * 2);
        ctx.fill();
      }

      // Hills
      ctx.fillStyle = '#00a800';
      for (let i = 0; i < 10; i++) {
        const hx = (i * 350) - (cam * 0.5) % 3500;
        ctx.beginPath();
        ctx.arc(hx, 410, 80, Math.PI, 0);
        ctx.fill();
      }

      // Bushes
      ctx.fillStyle = '#22c55e';
      for (let i = 0; i < 12; i++) {
        const bx = (i * 280 + 100) - (cam * 0.8) % 3500;
        ctx.beginPath();
        ctx.arc(bx, 384, 20, Math.PI, 0);
        ctx.arc(bx + 18, 384, 26, Math.PI, 0);
        ctx.arc(bx + 36, 384, 20, Math.PI, 0);
        ctx.fill();
      }

      // Offset by camera
      ctx.translate(-cam, 0);

      // Render Blocks
      for (const b of g.blocks) {
        if (b.type === 'empty') {
          // Hit brown empty block
          ctx.fillStyle = '#9a3412';
          ctx.fillRect(b.x, b.y + (b.bounceY || 0), b.w, b.h);
          ctx.strokeStyle = '#431407';
          ctx.strokeRect(b.x, b.y + (b.bounceY || 0), b.w, b.h);
        } else if (b.type === 'ground') {
          // Ground tile
          ctx.fillStyle = '#c2410c';
          ctx.fillRect(b.x, b.y, b.w, b.h);
          ctx.fillStyle = '#15803d';
          ctx.fillRect(b.x, b.y, b.w, 6);
          ctx.strokeStyle = '#7c2d12';
          ctx.strokeRect(b.x, b.y, b.w, b.h);
        } else if (b.type === 'brick') {
          ctx.fillStyle = '#b45309';
          ctx.fillRect(b.x, b.y + (b.bounceY || 0), b.w, b.h);
          // Brick lines
          ctx.fillStyle = '#78350f';
          ctx.fillRect(b.x, b.y + (b.bounceY || 0) + 14, b.w, 2);
          ctx.fillRect(b.x + 16, b.y + (b.bounceY || 0), 2, 14);
          ctx.fillRect(b.x + 8, b.y + (b.bounceY || 0) + 16, 2, 14);
          ctx.strokeStyle = '#451a03';
          ctx.strokeRect(b.x, b.y + (b.bounceY || 0), b.w, b.h);
        } else if (b.type === 'question') {
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(b.x, b.y + (b.bounceY || 0), b.w, b.h);
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 2;
          ctx.strokeRect(b.x, b.y + (b.bounceY || 0), b.w, b.h);
          ctx.lineWidth = 1;
          // ? mark
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 20px monospace';
          ctx.fillText('?', b.x + 10, b.y + (b.bounceY || 0) + 24);
        } else if (b.type === 'pipe-top') {
          ctx.fillStyle = '#16a34a';
          ctx.fillRect(b.x, b.y, b.w, b.h);
          ctx.fillStyle = '#4ade80';
          ctx.fillRect(b.x + 4, b.y + 3, 6, b.h - 6);
          ctx.strokeStyle = '#052e16';
          ctx.strokeRect(b.x, b.y, b.w, b.h);
        } else if (b.type === 'pipe') {
          ctx.fillStyle = '#15803d';
          ctx.fillRect(b.x, b.y, b.w, b.h);
          ctx.fillStyle = '#4ade80';
          ctx.fillRect(b.x + 4, b.y, 6, b.h);
          ctx.strokeStyle = '#052e16';
          ctx.strokeRect(b.x, b.y, b.w, b.h);
        } else if (b.type === 'block') {
          ctx.fillStyle = '#d97706';
          ctx.fillRect(b.x, b.y, b.w, b.h);
          ctx.strokeStyle = '#78350f';
          ctx.strokeRect(b.x, b.y, b.w, b.h);
        }
      }

      // Render loose coins
      for (const c of g.coinsList) {
        if (c.collected) continue;
        c.anim = (c.anim + 0.1) % (Math.PI * 2);
        const scaleX = Math.cos(c.anim);
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, Math.abs(scaleX) * 8 + 2, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#b45309';
        ctx.stroke();
      }

      // Render mushrooms
      for (const m of g.mushrooms) {
        if (m.collected) continue;
        // Cap
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(m.x + 10, m.y + 8, 10, Math.PI, 0);
        ctx.fill();
        // White dots
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(m.x + 6, m.y + 4, 3, 0, Math.PI * 2);
        ctx.arc(m.x + 14, m.y + 4, 3, 0, Math.PI * 2);
        ctx.fill();
        // Stem
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(m.x + 4, m.y + 8, 12, 12);
      }

      // Render flag pole & castle
      const flag = g.flag;
      // Castle at end
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(flag.x + 120, 240, 140, 144);
      // Castle battlements
      ctx.fillRect(flag.x + 120, 210, 30, 30);
      ctx.fillRect(flag.x + 175, 210, 30, 30);
      ctx.fillRect(flag.x + 230, 210, 30, 30);
      // Castle door
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(flag.x + 190, 320, 24, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(flag.x + 166, 320, 48, 64);

      // Pole
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(flag.x, flag.y, 6, flag.poleHeight);
      // Finial ball
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(flag.x + 3, flag.y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Flag
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(flag.x + 6, flag.flagY);
      ctx.lineTo(flag.x + 40, flag.flagY + 15);
      ctx.lineTo(flag.x + 6, flag.flagY + 30);
      ctx.fill();

      // Render Enemies
      for (const e of g.enemies) {
        if (!e.alive && e.squishedTimer <= 0) continue;

        if (e.alive) {
          // Goomba body
          ctx.fillStyle = '#92400e';
          ctx.beginPath();
          ctx.ellipse(e.x + 12, e.y + 10, 12, 10, 0, 0, Math.PI * 2);
          ctx.fill();
          // Eyes
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(e.x + 4, e.y + 6, 4, 6);
          ctx.fillRect(e.x + 14, e.y + 6, 4, 6);
          ctx.fillStyle = '#000000';
          ctx.fillRect(e.x + 6, e.y + 8, 2, 4);
          ctx.fillRect(e.x + 14, e.y + 8, 2, 4);
          // Feet
          ctx.fillStyle = '#451a03';
          const step = Math.floor(Date.now() / 150) % 2;
          if (step === 0) {
            ctx.fillRect(e.x + 1, e.y + 18, 8, 6);
            ctx.fillRect(e.x + 14, e.y + 17, 8, 7);
          } else {
            ctx.fillRect(e.x + 2, e.y + 17, 8, 7);
            ctx.fillRect(e.x + 15, e.y + 18, 8, 6);
          }
        } else {
          // Squished goomba
          ctx.fillStyle = '#92400e';
          ctx.fillRect(e.x + 2, e.y + 16, 20, 8);
          ctx.fillStyle = '#000000';
          ctx.fillRect(e.x + 6, e.y + 18, 4, 2);
          ctx.fillRect(e.x + 14, e.y + 18, 4, 2);
        }
      }

      // Render Player (Mario!)
      if (p.invulnerable % 4 < 2) {
        const px = p.x;
        const py = p.y;
        const ph = p.h;
        const pw = p.w;

        // Cap / Hat
        ctx.fillStyle = '#dc2626'; // Red cap
        ctx.fillRect(px + (p.facing === 'right' ? 4 : 0), py, pw - 4, 8);
        ctx.fillRect(px + (p.facing === 'right' ? 8 : -2), py + 4, pw - 4, 4);

        // Face & Nose
        ctx.fillStyle = '#fed7aa'; // Skin
        ctx.fillRect(px + (p.facing === 'right' ? 4 : 2), py + 8, 14, 8);
        // Mustache
        ctx.fillStyle = '#451a03';
        ctx.fillRect(px + (p.facing === 'right' ? 10 : 2), py + 12, 8, 4);

        // Overalls & Shirt
        ctx.fillStyle = '#dc2626'; // Red shirt
        ctx.fillRect(px + 4, py + 16, pw - 8, ph - 24);

        ctx.fillStyle = '#2563eb'; // Blue overalls
        ctx.fillRect(px + 2, py + 20, pw - 4, ph - 24);
        // Yellow buttons
        ctx.fillStyle = '#facc15';
        ctx.fillRect(px + 5, py + 22, 2, 2);
        ctx.fillRect(px + pw - 7, py + 22, 2, 2);

        // Shoes
        ctx.fillStyle = '#78350f';
        const walkCycle = Math.floor(p.animTimer) % 3;
        if (!p.grounded) {
          // Jump pose
          ctx.fillRect(px - 2, py + ph - 6, 10, 6);
          ctx.fillRect(px + pw - 8, py + ph - 4, 10, 4);
        } else if (walkCycle === 1) {
          ctx.fillRect(px - 1, py + ph - 6, 10, 6);
          ctx.fillRect(px + pw - 7, py + ph - 6, 10, 6);
        } else {
          ctx.fillRect(px, py + ph - 6, 8, 6);
          ctx.fillRect(px + pw - 8, py + ph - 6, 8, 6);
        }
      }

      // Render Particles
      for (const pt of g.particles) {
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, 4, 4);
      }

      // Render Floating texts
      for (const ft of g.floatingTexts) {
        ctx.fillStyle = ft.color;
        ctx.font = 'bold 14px monospace';
        ctx.fillText(ft.text, ft.x, ft.y);
      }

      ctx.restore();

      // Top HUD (Arcade authentic)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.fillRect(0, 0, canvas.width, 42);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px monospace';
      ctx.fillText('MARIO', 24, 18);
      ctx.fillText(String(g.score).padStart(6, '0'), 24, 34);

      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`COINS: x${String(g.coins).padStart(2, '0')}`, 160, 26);

      ctx.fillStyle = '#ffffff';
      ctx.fillText('WORLD', 290, 18);
      ctx.fillText('1-1', 300, 34);

      ctx.fillText('TIME', 380, 18);
      ctx.fillText(String(g.timeLeft).padStart(3, '0'), 385, 34);

      ctx.fillStyle = '#ef4444';
      ctx.fillText(`LIVES: ${g.lives}`, 470, 26);

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(timerInterval);
    };
  }, [gameState]);

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-white select-none overflow-hidden font-sans">
      {/* Game Window Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
          <span className="font-semibold tracking-wider text-red-400">SUPER MARIO ARCADE 1985</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSoundMuted(!soundMuted);
              sounds.enabled = soundMuted;
            }}
            className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
            title="Toggle Sound"
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            onClick={startGame}
            className="flex items-center space-x-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative flex-1 flex items-center justify-center bg-black overflow-hidden">
        <canvas
          ref={canvasRef}
          width={600}
          height={440}
          className="max-h-full max-w-full aspect-[600/440] object-contain shadow-2xl"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Start Overlay */}
        {gameState === 'menu' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="text-4xl font-extrabold text-red-500 tracking-wider mb-2 drop-shadow-md">
              SUPER MARIO BROS
            </div>
            <div className="text-amber-400 font-mono text-sm mb-6">WINDOWS 11 RETRO EDITION</div>
            
            <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-4 max-w-sm text-xs text-slate-300 space-y-2 mb-6 text-left">
              <div className="font-bold text-white mb-1">🎮 CONTROLS:</div>
              <div>• <span className="text-amber-400 font-mono">Arrow Keys / WASD</span>: Run Left & Right</div>
              <div>• <span className="text-amber-400 font-mono">Up / Space / W</span>: Jump</div>
              <div>• <span className="text-amber-400 font-mono">Shift / J</span>: Turbo Sprint</div>
              <div>• Stomp Goombas, hit <span className="text-amber-400">?</span> blocks for coins and Super Mushrooms, reach the flagpole!</div>
            </div>

            <button
              onClick={startGame}
              className="flex items-center space-x-2 px-6 py-2.5 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold rounded-lg shadow-lg transition"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>START GAME</span>
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-red-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
            <div className="text-4xl font-black text-red-500 mb-2">GAME OVER</div>
            <div className="text-slate-300 text-sm mb-1">Final Score: <span className="font-mono text-amber-400 font-bold">{score}</span></div>
            <div className="text-slate-400 text-xs mb-6">Coins Collected: {coins}</div>
            <button
              onClick={startGame}
              className="flex items-center space-x-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shadow-lg active:scale-95 transition"
            >
              <RotateCcw className="w-5 h-5" />
              <span>TRY AGAIN</span>
            </button>
          </div>
        )}

        {/* Victory Overlay */}
        {gameState === 'victory' && (
          <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="text-4xl font-black text-emerald-400 mb-2">COURSE CLEAR!</div>
            <div className="text-lg text-amber-300 font-bold mb-2">CONGRATULATIONS! 🎉</div>
            <div className="text-slate-200 text-sm mb-6">
              Total Score: <span className="font-mono text-amber-400 font-bold text-lg">{score}</span>
            </div>
            <button
              onClick={startGame}
              className="flex items-center space-x-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg active:scale-95 transition"
            >
              <RotateCcw className="w-5 h-5" />
              <span>PLAY AGAIN</span>
            </button>
          </div>
        )}
      </div>

      {/* Responsive Touch / On-screen Controls (for mobile or mouse) */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-t border-slate-800 text-slate-300">
        <div className="flex space-x-2">
          <button
            onPointerDown={() => { keysRef.current.left = true; }}
            onPointerUp={() => { keysRef.current.left = false; }}
            onPointerLeave={() => { keysRef.current.left = false; }}
            className="w-11 h-11 bg-slate-800 active:bg-slate-700 rounded-lg flex items-center justify-center shadow"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onPointerDown={() => { keysRef.current.right = true; }}
            onPointerUp={() => { keysRef.current.right = false; }}
            onPointerLeave={() => { keysRef.current.right = false; }}
            className="w-11 h-11 bg-slate-800 active:bg-slate-700 rounded-lg flex items-center justify-center shadow"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-[11px] text-slate-400 hidden sm:block">
          Use Keyboard <span className="text-slate-200">Arrows / Space</span> or Touch buttons
        </div>

        <div className="flex space-x-2">
          <button
            onPointerDown={() => { keysRef.current.run = true; }}
            onPointerUp={() => { keysRef.current.run = false; }}
            onPointerLeave={() => { keysRef.current.run = false; }}
            className="w-11 h-11 bg-amber-700/80 active:bg-amber-600 text-white rounded-lg flex items-center justify-center shadow text-xs font-bold"
          >
            <Zap className="w-4 h-4" />
          </button>
          <button
            onPointerDown={() => {
              if (gameRef.current.player.grounded) sounds.playMarioJump();
              keysRef.current.jump = true;
            }}
            onPointerUp={() => { keysRef.current.jump = false; }}
            onPointerLeave={() => { keysRef.current.jump = false; }}
            className="w-11 h-11 bg-red-600 active:bg-red-500 text-white rounded-lg flex items-center justify-center shadow font-bold"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
