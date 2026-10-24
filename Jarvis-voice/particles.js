'use strict';

// ============================================================
//  JARVIS Particle Engine — 42 simulation modes
// ============================================================

const ParticleEngine = (() => {

  let canvas, ctx, W, H, cx, cy;
  let animId = null;
  let frameCount = 0;
  let lastFPS = performance.now();
  let fps = 0;
  let transitionAlpha = 1;
  let transitioning = false;

  const GOLD = '#FFB800';
  const GOLD_R = 255, GOLD_G = 184, GOLD_B = 0;

  // ──────────────────────────────────────────────
  //  Particle pool
  // ──────────────────────────────────────────────
  let particles = [];
  let currentSim = 'vortex';
  let simTime = 0;

  const MAX_PARTICLES = 320;

  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function() {
    this.x   = cx;
    this.y   = cy;
    this.vx  = (Math.random() - 0.5) * 4;
    this.vy  = (Math.random() - 0.5) * 4;
    this.life = Math.random();
    this.maxLife = 0.5 + Math.random() * 0.5;
    this.size = 1 + Math.random() * 3;
    this.angle  = Math.random() * Math.PI * 2;
    this.radius = 20 + Math.random() * 180;
    this.speed  = 0.01 + Math.random() * 0.03;
    this.hue    = Math.random() * 60 - 30; // offset from gold
    this.alpha  = 0.3 + Math.random() * 0.7;
    this.phase  = Math.random() * Math.PI * 2;
    this.depth  = Math.random();
    this.color  = GOLD;
    this.id     = Math.random();
  };

  // ──────────────────────────────────────────────
  //  Simulation definitions
  // ──────────────────────────────────────────────

  const SIMS = {

    vortex(p, i, dt) {
      p.angle += p.speed * (1 + p.radius / 200);
      p.radius -= 0.3;
      if (p.radius < 5) { p.reset(); p.radius = 80 + Math.random() * 150; }
      p.x = cx + Math.cos(p.angle) * p.radius;
      p.y = cy + Math.sin(p.angle) * p.radius * 0.5;
      const a = 0.6 + 0.4 * (1 - p.radius / 200);
      draw(p, a);
    },

    dna(p, i, dt) {
      const t = simTime * 0.015 + i * 0.15;
      const strand = (i % 2 === 0) ? 1 : -1;
      p.x = cx + Math.sin(t) * 120 * strand;
      p.y = cy - 200 + (i / particles.length) * 400;
      const a = 0.5 + 0.5 * Math.abs(Math.sin(t));
      draw(p, a, p.size * 1.5);
    },

    galaxy(p, i, dt) {
      p.angle += p.speed * 0.5;
      const arm = (i % 3) * (Math.PI * 2 / 3);
      const spiral = p.radius * 0.012;
      p.x = cx + Math.cos(p.angle + arm + spiral) * p.radius;
      p.y = cy + Math.sin(p.angle + arm + spiral) * p.radius * 0.35;
      const a = 0.3 + 0.7 * (p.radius / 200);
      draw(p, a, p.size * (1 - p.radius / 300));
    },

    neural(p, i, dt) {
      const nodeCount = 12;
      const ni = i % nodeCount;
      const targetX = cx + Math.cos(ni / nodeCount * Math.PI * 2) * 150;
      const targetY = cy + Math.sin(ni / nodeCount * Math.PI * 2) * 100;
      p.x += (targetX - p.x) * 0.05 + (Math.random() - 0.5) * 2;
      p.y += (targetY - p.y) * 0.05 + (Math.random() - 0.5) * 2;

      if (i < particles.length - 1 && i % 8 === 0) {
        const q = particles[i + 1];
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(${GOLD_R},${GOLD_G},${GOLD_B},0.1)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      draw(p, 0.7, p.size * 2);
    },

    wave(p, i, dt) {
      p.x = (i / particles.length) * W;
      const amp = 80 + 40 * Math.sin(simTime * 0.02);
      p.y = cy + Math.sin(p.x * 0.015 + simTime * 0.04 + p.phase) * amp
               + Math.sin(p.x * 0.03 + simTime * 0.02) * amp * 0.3;
      const a = 0.4 + 0.6 * Math.abs(Math.sin(p.x * 0.01 + simTime * 0.03));
      draw(p, a, p.size);
    },

    sphere(p, i, dt) {
      p.angle += p.speed * 0.8;
      p.phase += 0.005;
      const lat = (i / particles.length) * Math.PI * 2;
      const lon = p.angle;
      const r = 160;
      p.x = cx + Math.cos(lat) * Math.cos(lon) * r;
      p.y = cy + Math.cos(lat) * Math.sin(lon) * r * 0.5 + Math.sin(lat) * r * 0.3;
      const a = 0.3 + 0.7 * (Math.cos(lat) * 0.5 + 0.5);
      draw(p, a);
    },

    orbit(p, i, dt) {
      const orbitR = 60 + (i % 5) * 30;
      p.angle += p.speed * (80 / orbitR);
      p.x = cx + Math.cos(p.angle) * orbitR;
      p.y = cy + Math.sin(p.angle) * orbitR * 0.5;
      const a = 0.5 + 0.5 * Math.sin(p.angle * 3);
      draw(p, a, p.size * (orbitR / 120));
    },

    rain(p, i, dt) {
      p.y += 4 + p.depth * 6;
      p.x += (Math.random() - 0.5) * 0.5;
      if (p.y > H + 10) { p.y = -10; p.x = Math.random() * W; }
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x, p.y - 8 - p.depth * 10);
      ctx.strokeStyle = `rgba(${GOLD_R},${GOLD_G},${GOLD_B},${0.3 + p.depth * 0.4})`;
      ctx.lineWidth = p.depth;
      ctx.stroke();
    },

    fire(p, i, dt) {
      p.x += (Math.random() - 0.5) * 3 + Math.sin(simTime * 0.03 + p.phase) * 2;
      p.y -= 1.5 + p.depth * 3;
      p.life -= 0.008;
      if (p.life <= 0 || p.y < cy - 200) {
        p.x = cx + (Math.random() - 0.5) * 120;
        p.y = cy + 60;
        p.life = 0.5 + Math.random() * 0.5;
        p.depth = Math.random();
      }
      const progress = 1 - p.life;
      const r = Math.round(GOLD_R + (255 - GOLD_R) * progress);
      const g = Math.round(GOLD_G * (1 - progress * 0.8));
      const b = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (1.5 - progress), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${p.life * 0.7})`;
      ctx.fill();
    },

    matrix(p, i, dt) {
      const col = Math.floor(i / 8);
      const row = i % 8;
      const cols = Math.ceil(W / 24);
      p.x = (col % cols) * 24 + 12;
      p.y += 3 + p.depth * 4;
      if (p.y > H + 20) p.y = -10 - Math.random() * H;
      ctx.font = `${10 + p.depth * 4}px 'Courier New'`;
      ctx.fillStyle = `rgba(${GOLD_R},${GOLD_G},${GOLD_B},${0.2 + p.depth * 0.6})`;
      ctx.fillText(String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96)), p.x, p.y);
    },

    spiral(p, i, dt) {
      p.angle += p.speed * 1.5;
      const r = 10 + (p.angle % (Math.PI * 2)) * 20;
      p.x = cx + Math.cos(p.angle) * r;
      p.y = cy + Math.sin(p.angle) * r * 0.6;
      if (r > 220) p.angle = 0;
      const a = 0.3 + 0.7 * (r / 220);
      draw(p, a, p.size * (r / 200));
    },

    explode(p, i, dt) {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.vy += 0.05;
      p.life -= 0.006;
      if (p.life <= 0) {
        p.x = cx; p.y = cy;
        const a = Math.random() * Math.PI * 2;
        const s = 2 + Math.random() * 8;
        p.vx = Math.cos(a) * s;
        p.vy = Math.sin(a) * s;
        p.life = 0.4 + Math.random() * 0.6;
      }
      draw(p, p.life, p.size * p.life);
    },

    flow(p, i, dt) {
      const angle = Math.sin(p.x * 0.008 + simTime * 0.01) * Math.PI
                  + Math.cos(p.y * 0.008 + simTime * 0.008) * Math.PI;
      p.x += Math.cos(angle) * 1.5;
      p.y += Math.sin(angle) * 1.5;
      if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
        p.x = Math.random() * W;
        p.y = Math.random() * H;
      }
      draw(p, 0.4, p.size * 0.8);
    },

    constellation(p, i, dt) {
      p.x += Math.sin(simTime * 0.005 + p.phase) * 0.3;
      p.y += Math.cos(simTime * 0.005 + p.phase * 1.3) * 0.3;
      if (i % 3 === 0) {
        const q = particles[(i + 7) % particles.length];
        const d = Math.hypot(q.x - p.x, q.y - p.y);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${GOLD_R},${GOLD_G},${GOLD_B},${0.1 * (1 - d / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      draw(p, 0.6 + 0.4 * Math.sin(simTime * 0.02 + p.phase), p.size);
    },

    wormhole(p, i, dt) {
      p.angle += p.speed * 2;
      p.radius = 5 + ((p.angle / (Math.PI * 20)) % 1) * 180;
      p.x = cx + Math.cos(p.angle) * p.radius;
      p.y = cy + Math.sin(p.angle) * p.radius * 0.4;
      const a = 0.2 + 0.8 * (1 - p.radius / 180);
      draw(p, a, p.size * (1 - p.radius / 200));
    },

    reactor(p, i, dt) {
      const ring = i % 5;
      const ringR = 30 + ring * 28;
      p.angle += p.speed * (ring % 2 === 0 ? 1 : -1) * (1 + ring * 0.3);
      p.x = cx + Math.cos(p.angle) * ringR;
      p.y = cy + Math.sin(p.angle) * ringR * 0.5;
      draw(p, 0.6 + 0.4 * Math.sin(simTime * 0.05 + ring), p.size);
    },

    storm(p, i, dt) {
      const dx = p.x - cx, dy = p.y - cy;
      const d = Math.hypot(dx, dy) || 1;
      const tangX = -dy / d, tangY = dx / d;
      p.x += tangX * 3 + (cx - p.x) * 0.003;
      p.y += tangY * 3 + (cy - p.y) * 0.003;
      p.x += (Math.random() - 0.5) * 2;
      p.y += (Math.random() - 0.5) * 2;
      draw(p, 0.4 + 0.3 * (1 - d / 250), p.size * (1 - d / 300));
    },

    network(p, i, dt) {
      p.x += Math.sin(simTime * 0.008 + p.phase) * 0.5 + p.vx * 0.1;
      p.y += Math.cos(simTime * 0.008 + p.phase * 1.2) * 0.5 + p.vy * 0.1;
      p.vx *= 0.99; p.vy *= 0.99;
      p.x = Math.max(0, Math.min(W, p.x));
      p.y = Math.max(0, Math.min(H, p.y));
      particles.slice(i + 1, i + 5).forEach(q => {
        const d = Math.hypot(q.x - p.x, q.y - p.y);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${GOLD_R},${GOLD_G},${GOLD_B},${0.15 * (1 - d / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
      draw(p, 0.8, p.size * 1.5);
    },

    aurora(p, i, dt) {
      p.x = (i / particles.length) * W;
      const wave1 = Math.sin(p.x * 0.004 + simTime * 0.015) * 100;
      const wave2 = Math.sin(p.x * 0.006 + simTime * 0.01 + 1) * 60;
      p.y = H * 0.3 + wave1 + wave2 + (i % 3) * 15;
      const hueShift = (Math.sin(p.x * 0.005 + simTime * 0.01) * 0.5 + 0.5);
      const r = Math.round(GOLD_R * (0.5 + hueShift * 0.5));
      const g = Math.round(GOLD_G + (255 - GOLD_G) * hueShift * 0.3);
      const b = Math.round(100 * hueShift);
      draw(p, 0.3 + 0.5 * hueShift, p.size * 2, `rgba(${r},${g},${b},1)`);
    },

    clock(p, i, dt) {
      const total = particles.length;
      if (i < total * 0.6) {
        const angle = (i / (total * 0.6)) * Math.PI * 2 - Math.PI / 2;
        p.x = cx + Math.cos(angle) * 160;
        p.y = cy + Math.sin(angle) * 160;
      } else if (i < total * 0.8) {
        const d = new Date();
        const secA = (d.getSeconds() / 60) * Math.PI * 2 - Math.PI / 2;
        const t = (i - total * 0.6) / (total * 0.2);
        p.x = cx + Math.cos(secA) * t * 140;
        p.y = cy + Math.sin(secA) * t * 140;
      } else {
        const d = new Date();
        const minA = (d.getMinutes() / 60) * Math.PI * 2 - Math.PI / 2;
        const t = (i - total * 0.8) / (total * 0.2);
        p.x = cx + Math.cos(minA) * t * 100;
        p.y = cy + Math.sin(minA) * t * 100;
      }
      draw(p, 0.7, p.size);
    },

    repel(p, i, dt) {
      const dx = p.x - cx, dy = p.y - cy;
      const d = Math.hypot(dx, dy) || 1;
      const force = Math.max(0, 200 - d) * 0.05;
      p.vx += (dx / d) * force;
      p.vy += (dy / d) * force;
      p.vx *= 0.92; p.vy *= 0.92;
      p.x += p.vx; p.y += p.vy;
      p.x = Math.max(0, Math.min(W, p.x));
      p.y = Math.max(0, Math.min(H, p.y));
      draw(p, 0.5, p.size);
    },

    attract(p, i, dt) {
      const dx = cx - p.x, dy = cy - p.y;
      const d = Math.hypot(dx, dy) || 1;
      p.vx += (dx / d) * 0.8;
      p.vy += (dy / d) * 0.8;
      p.vx *= 0.94; p.vy *= 0.94;
      p.x += p.vx; p.y += p.vy;
      const a = 0.2 + 0.8 * (1 - d / 400);
      draw(p, a, p.size * (1 - d / 500));
    },

    fountain(p, i, dt) {
      p.y += p.vy;
      p.x += p.vx;
      p.vy += 0.15;
      p.life -= 0.008;
      if (p.life <= 0 || p.y > H + 20) {
        p.x = cx + (Math.random() - 0.5) * 40;
        p.y = cy + 40;
        const a = (Math.random() - 0.5) * 0.8;
        p.vx = Math.sin(a) * (2 + Math.random() * 4);
        p.vy = -(4 + Math.random() * 8);
        p.life = 0.5 + Math.random() * 0.5;
      }
      draw(p, p.life, p.size * p.life);
    },

    chaos(p, i, dt) {
      p.vx += (Math.random() - 0.5) * 0.8 + Math.sin(p.y * 0.02) * 0.3;
      p.vy += (Math.random() - 0.5) * 0.8 + Math.cos(p.x * 0.02) * 0.3;
      p.vx *= 0.96; p.vy *= 0.96;
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) { p.vx *= -1; p.x = Math.max(0, Math.min(W, p.x)); }
      if (p.y < 0 || p.y > H) { p.vy *= -1; p.y = Math.max(0, Math.min(H, p.y)); }
      draw(p, 0.5, p.size);
    },

    grid(p, i, dt) {
      const cols = Math.ceil(Math.sqrt(particles.length * W / H));
      const rows = Math.ceil(particles.length / cols);
      const col = i % cols, row = Math.floor(i / cols);
      const tx = (col + 0.5) / cols * W;
      const ty = (row + 0.5) / rows * H;
      const wave = Math.sin(simTime * 0.03 + col * 0.5 + row * 0.5) * 20;
      p.x += (tx - p.x) * 0.1;
      p.y += (ty + wave - p.y) * 0.1;
      draw(p, 0.5 + 0.4 * Math.sin(simTime * 0.04 + i * 0.1), p.size);
    },

    morph(p, i, dt) {
      const phase = Math.floor(simTime / 180) % 4;
      const t = (simTime % 180) / 180;
      const angle = (i / particles.length) * Math.PI * 2;
      let tx, ty;
      if (phase === 0) { tx = cx + Math.cos(angle) * 150; ty = cy + Math.sin(angle) * 150; }
      else if (phase === 1) { tx = cx + (Math.random() - 0.5) * 300; ty = cy + (Math.random() - 0.5) * 200; }
      else if (phase === 2) { tx = cx + Math.cos(angle * 3) * 150; ty = cy + Math.sin(angle * 2) * 100; }
      else { tx = cx; ty = cy; }
      p.x += (tx - p.x) * 0.04;
      p.y += (ty - p.y) * 0.04;
      draw(p, 0.5 + 0.4 * t, p.size);
    },

    laser(p, i, dt) {
      const beamCount = 6;
      const beam = i % beamCount;
      const angle = (beam / beamCount) * Math.PI * 2 + simTime * 0.02;
      const t = (i / particles.length) * 1.2;
      p.x = cx + Math.cos(angle) * t * 220;
      p.y = cy + Math.sin(angle) * t * 120;
      draw(p, 0.8 - t * 0.4, p.size * (1 - t * 0.5));
    },

    bounce(p, i, dt) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      if (p.x < p.size)  { p.vx = Math.abs(p.vx);  p.x = p.size; }
      if (p.x > W - p.size) { p.vx = -Math.abs(p.vx); p.x = W - p.size; }
      if (p.y > H - p.size) { p.vy = -Math.abs(p.vy) * 0.85; p.y = H - p.size; }
      draw(p, 0.7, p.size);
    },

    rings(p, i, dt) {
      const ringIdx = i % 6;
      const ringR = 40 + ringIdx * 28;
      p.angle += p.speed * (ringIdx % 2 === 0 ? 1.2 : -1.2);
      p.x = cx + Math.cos(p.angle) * ringR;
      p.y = cy + Math.sin(p.angle) * ringR;
      draw(p, 0.6 + 0.3 * Math.sin(simTime * 0.05 + ringIdx), p.size);
    },

    tunnel(p, i, dt) {
      p.depth -= 0.02;
      if (p.depth <= 0) { p.depth = 1; p.angle = Math.random() * Math.PI * 2; }
      const scale = 1 / (p.depth + 0.01);
      p.x = cx + Math.cos(p.angle) * scale * 80;
      p.y = cy + Math.sin(p.angle) * scale * 60;
      draw(p, Math.min(1, scale * 0.2), p.size * scale * 0.5);
    },

    comet(p, i, dt) {
      const head = i % 20 === 0;
      if (head || p.life <= 0) {
        if (head) {
          p.x = Math.random() * W;
          p.y = 0;
          p.vx = (Math.random() - 0.5) * 3;
          p.vy = 3 + Math.random() * 5;
          p.life = 1;
        }
      }
      const leader = particles[Math.floor(i / 20) * 20];
      if (leader) {
        p.x = leader.x - (i % 20) * (leader.vx || 0.5) * 1.2;
        p.y = leader.y - (i % 20) * (leader.vy || 2) * 1.2;
      }
      p.life -= 0.005;
      if (p.y > H + 20) p.life = 0;
      draw(p, Math.max(0, p.life - (i % 20) * 0.04), p.size * (1 - (i % 20) * 0.04));
    },

    mist(p, i, dt) {
      p.x += Math.sin(simTime * 0.005 + p.phase) * 0.5;
      p.y += Math.cos(simTime * 0.004 + p.phase * 1.3) * 0.3;
      p.x = Math.max(0, Math.min(W, p.x));
      p.y = Math.max(0, Math.min(H, p.y));
      ctx.beginPath();
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 8);
      grad.addColorStop(0, `rgba(${GOLD_R},${GOLD_G},${GOLD_B},0.12)`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.arc(p.x, p.y, p.size * 8, 0, Math.PI * 2);
      ctx.fill();
    },

    shockwave(p, i, dt) {
      p.radius += 2;
      if (p.radius > 300) p.radius = 0;
      const delay = (i / particles.length) * 200;
      const r = (p.radius + delay) % 300;
      p.x = cx + Math.cos(p.angle) * r;
      p.y = cy + Math.sin(p.angle) * r * 0.5;
      draw(p, 0.6 * (1 - r / 300), p.size * (1 - r / 300));
    },

    disco(p, i, dt) {
      if (Math.floor(simTime) % 8 === 0 && simTime % 1 < 0.5) {
        p.x = Math.random() * W;
        p.y = Math.random() * H;
      }
      p.x += (Math.random() - 0.5) * 0.5;
      p.y += (Math.random() - 0.5) * 0.5;
      const hue = (simTime * 3 + i * 15) % 360;
      const r2 = Math.round(255 * Math.abs(Math.sin(hue * Math.PI / 180)));
      const g2 = Math.round(255 * Math.abs(Math.sin((hue + 120) * Math.PI / 180)));
      const b2 = Math.round(255 * Math.abs(Math.sin((hue + 240) * Math.PI / 180)));
      draw(p, 0.8, p.size * 2, `rgba(${r2},${g2},${b2},1)`);
    },

    weave(p, i, dt) {
      const col = i % 16;
      p.x = (col + 0.5) / 16 * W;
      const offset = col % 2 === 0 ? 0 : Math.PI;
      p.y = cy + Math.sin(simTime * 0.03 + (i / particles.length) * Math.PI * 4 + offset) * 120;
      draw(p, 0.6, p.size);
    },

    magneto(p, i, dt) {
      const dx = cx - p.x, dy = cy - p.y;
      const d = Math.hypot(dx, dy) || 1;
      const tangX = -dy / d, tangY = dx / d;
      p.vx += (dx / d) * 0.2 + tangX * 1.5;
      p.vy += (dy / d) * 0.2 + tangY * 1.5;
      p.vx *= 0.95; p.vy *= 0.95;
      p.x += p.vx; p.y += p.vy;
      draw(p, 0.5 + 0.3 * (1 - d / 300), p.size);
    },

    nebula(p, i, dt) {
      p.x += Math.sin(simTime * 0.006 + p.phase) * 0.8;
      p.y += Math.cos(simTime * 0.005 + p.phase * 0.7) * 0.6;
      const d = Math.hypot(p.x - cx, p.y - cy);
      const hueShift = d / 300;
      const r2 = Math.round(GOLD_R + (180 - GOLD_R) * hueShift);
      const g2 = Math.round(GOLD_G * (1 - hueShift * 0.5));
      const b2 = Math.round(200 * hueShift);
      ctx.beginPath();
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
      grad.addColorStop(0, `rgba(${r2},${g2},${b2},0.15)`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
      ctx.fill();
    },

    crystal(p, i, dt) {
      p.angle += p.speed * 0.3;
      const sides = 6;
      const sideAngle = Math.floor(p.angle / (Math.PI * 2 / sides)) * (Math.PI * 2 / sides);
      p.x = cx + Math.cos(sideAngle) * p.radius * 0.8;
      p.y = cy + Math.sin(sideAngle) * p.radius * 0.5;
      if (i > 0 && i % 4 === 0) {
        const q = particles[i - 1];
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(${GOLD_R},${GOLD_G},${GOLD_B},0.15)`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      draw(p, 0.6, p.size * 1.2);
    },

    heartbeat(p, i, dt) {
      const beat = simTime % 60;
      const pulse = beat < 5  ? beat / 5 :
                    beat < 15 ? (15 - beat) / 10 :
                    beat < 20 ? (beat - 15) / 5 :
                    beat < 30 ? (30 - beat) / 10 : 0;
      p.angle = (i / particles.length) * Math.PI * 2;
      const r = 80 + pulse * 80;
      p.x = cx + Math.cos(p.angle) * r;
      p.y = cy + Math.sin(p.angle) * r * 0.5;
      draw(p, 0.4 + pulse * 0.6, p.size * (1 + pulse));
    },

    swarm(p, i, dt) {
      const leaderX = cx + Math.cos(simTime * 0.02) * 150;
      const leaderY = cy + Math.sin(simTime * 0.015) * 80;
      const dx = leaderX - p.x, dy = leaderY - p.y;
      p.vx += dx * 0.001 + (Math.random() - 0.5) * 0.5;
      p.vy += dy * 0.001 + (Math.random() - 0.5) * 0.5;
      p.vx *= 0.96; p.vy *= 0.96;
      p.x += p.vx; p.y += p.vy;
      draw(p, 0.5, p.size * 0.8);
    },

    pulse(p, i, dt) {
      const wave = Math.sin(simTime * 0.05 - i * 0.2) * 0.5 + 0.5;
      p.angle = (i / particles.length) * Math.PI * 2;
      const r = 60 + wave * 120;
      p.x = cx + Math.cos(p.angle) * r;
      p.y = cy + Math.sin(p.angle) * r * 0.5;
      draw(p, 0.3 + wave * 0.7, p.size * (0.5 + wave));
    },

    snowflake(p, i, dt) {
      p.y += 0.5 + p.depth * 1.5;
      p.x += Math.sin(simTime * 0.02 + p.phase) * 0.5;
      if (p.y > H + 10) { p.y = -10; p.x = Math.random() * W; }
      const arms = 6;
      for (let a = 0; a < arms; a++) {
        const angle = (a / arms) * Math.PI * 2 + p.angle;
        const len = p.size * 5 * p.depth;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + Math.cos(angle) * len, p.y + Math.sin(angle) * len);
        ctx.strokeStyle = `rgba(${GOLD_R},${GOLD_G},${GOLD_B},${0.4 * p.depth})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  };

  // Alias keys
  const SIM_ALIASES = {
    dna: 'dna', 'dna helix': 'dna', helix: 'dna',
    galaxy: 'galaxy', 'milky way': 'galaxy',
    neural: 'neural', neurons: 'neural',
    wave: 'wave', waves: 'wave',
    sphere: 'sphere',
    orbit: 'orbit', orbital: 'orbit',
    rain: 'rain', rainfall: 'rain',
    fire: 'fire', flames: 'fire',
    matrix: 'matrix',
    spiral: 'spiral',
    explode: 'explode', explosion: 'explode',
    flow: 'flow', flowfield: 'flow',
    constellation: 'constellation', stars: 'constellation',
    wormhole: 'wormhole',
    reactor: 'reactor',
    storm: 'storm',
    network: 'network',
    aurora: 'aurora', 'northern lights': 'aurora',
    clock: 'clock',
    repel: 'repel',
    attract: 'attract',
    fountain: 'fountain',
    chaos: 'chaos',
    grid: 'grid',
    morph: 'morph',
    laser: 'laser', lasers: 'laser',
    bounce: 'bounce',
    rings: 'rings',
    tunnel: 'tunnel',
    comet: 'comet', comets: 'comet',
    mist: 'mist', fog: 'mist',
    shockwave: 'shockwave',
    disco: 'disco',
    weave: 'weave',
    magneto: 'magneto',
    nebula: 'nebula',
    crystal: 'crystal',
    heartbeat: 'heartbeat', heart: 'heartbeat',
    swarm: 'swarm',
    pulse: 'pulse',
    snowflake: 'snowflake', snow: 'snowflake',
    vortex: 'vortex'
  };

  const SIM_NAMES = Object.keys(SIMS);

  // ──────────────────────────────────────────────
  //  Draw helper
  // ──────────────────────────────────────────────
  function draw(p, alpha = 0.7, size = p.size, color = null) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.3, size), 0, Math.PI * 2);
    ctx.fillStyle = color || `rgba(${GOLD_R},${GOLD_G},${GOLD_B},${Math.min(1, Math.max(0, alpha))})`;
    ctx.fill();
  }

  // ──────────────────────────────────────────────
  //  Init particles
  // ──────────────────────────────────────────────
  function initParticles() {
    particles = [];
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = new Particle();
      p.x = Math.random() * W;
      p.y = Math.random() * H;
      p.angle = Math.random() * Math.PI * 2;
      p.radius = 20 + Math.random() * 180;
      p.vx = (Math.random() - 0.5) * 4;
      p.vy = (Math.random() - 0.5) * 4;
      particles.push(p);
    }
  }

  // ──────────────────────────────────────────────
  //  Resize
  // ──────────────────────────────────────────────
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cx = W / 2;
    cy = H / 2;
  }

  // ──────────────────────────────────────────────
  //  Render loop
  // ──────────────────────────────────────────────
  function render() {
    animId = requestAnimationFrame(render);
    simTime++;

    // FPS
    frameCount++;
    const now = performance.now();
    if (now - lastFPS >= 1000) {
      fps = frameCount;
      frameCount = 0;
      lastFPS = now;
      const fpsEl = document.getElementById('fpsCounter');
      if (fpsEl) fpsEl.textContent = `FPS: ${fps}`;
      const pcEl = document.getElementById('particleCount');
      if (pcEl) pcEl.textContent = `PARTICLES: ${particles.length}`;
    }

    // Background with fade trail
    ctx.fillStyle = transitioning
      ? 'rgba(0,0,0,0.25)'
      : 'rgba(0,0,0,0.18)';
    ctx.fillRect(0, 0, W, H);

    const simFn = SIMS[currentSim] || SIMS.vortex;

    particles.forEach((p, i) => {
      try { simFn(p, i, 1); } catch(e) {}
    });

    if (transitioning) {
      transitionAlpha -= 0.04;
      if (transitionAlpha <= 0) { transitioning = false; transitionAlpha = 1; }
    }
  }

  // ──────────────────────────────────────────────
  //  Public API
  // ──────────────────────────────────────────────
  function init() {
    canvas = document.getElementById('particleCanvas');
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', () => { resize(); initParticles(); });
    initParticles();
    render();
    buildSimButtons();
    console.log('[JARVIS] Particle engine online. Simulations:', SIM_NAMES.join(', '));
  }

  function setSim(name) {
    const key = SIM_ALIASES[name.toLowerCase()] || name.toLowerCase();
    if (!SIMS[key]) {
      console.warn('[JARVIS] Unknown sim:', name);
      return false;
    }
    transitioning = true;
    transitionAlpha = 1;
    currentSim = key;
    simTime = 0;

    const nameEl = document.getElementById('simName');
    if (nameEl) {
      nameEl.style.opacity = '0';
      setTimeout(() => {
        nameEl.textContent = key.toUpperCase();
        nameEl.style.opacity = '1';
      }, 300);
    }

    document.querySelectorAll('.sim-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.sim === key);
    });

    console.log('[JARVIS] Sim switched to:', key);
    return true;
  }

  function detectSimFromText(text) {
    const lower = text.toLowerCase();
    for (const [alias, simKey] of Object.entries(SIM_ALIASES)) {
      if (lower.includes(alias)) return simKey;
    }
    return null;
  }

  function buildSimButtons() {
    const grid = document.getElementById('simGrid');
    if (!grid) return;
    grid.innerHTML = '';
    SIM_NAMES.forEach(name => {
      const btn = document.createElement('button');
      btn.className = 'sim-btn' + (name === currentSim ? ' active' : '');
      btn.textContent = name.toUpperCase();
      btn.dataset.sim = name;
      btn.addEventListener('click', () => setSim(name));
      grid.appendChild(btn);
    });
  }

  return { init, setSim, detectSimFromText, getSims: () => SIM_NAMES, getCurrent: () => currentSim };

})();
