import React from 'react';
import { WallpaperId } from '../../types';

interface WallpaperProps {
  wallpaper: WallpaperId;
}

export const DesktopWallpaper: React.FC<WallpaperProps> = ({ wallpaper }) => {
  switch (wallpaper) {
    case 'windows-hero':
      return (
        <div className="absolute inset-0 bg-[#030818] overflow-hidden">
          {/* Deep atmospheric backdrop with radial blue glow */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 80% 60% at 50% 50%, #0a2558 0%, #06132f 50%, #020713 100%)'
            }}
          />

          {/* Light beams emanating from the Windows Logo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Volumetric light ray shafts */}
            <div
              className="absolute w-[900px] h-[500px] opacity-40 mix-blend-screen"
              style={{
                background: 'conic-gradient(from 220deg at 50% 50%, transparent 0deg, rgba(56,189,248,0.25) 30deg, transparent 65deg, rgba(14,165,233,0.3) 120deg, transparent 180deg)'
              }}
            />
            <div className="absolute w-[600px] h-[400px] bg-sky-500/25 rounded-full blur-[100px] transform -rotate-12" />

            {/* The Iconic Angled Glowing 4-Pane Windows Logo */}
            <div
              className="relative z-10 transform -rotate-6 hover:scale-105 transition-transform duration-700 ease-out"
              style={{ perspective: '800px' }}
            >
              <svg
                width="280"
                height="280"
                viewBox="0 0 200 200"
                className="drop-shadow-[0_0_50px_rgba(56,189,248,0.7)]"
                style={{ transform: 'rotateY(-28deg) rotateX(12deg)' }}
              >
                <defs>
                  {/* Glowing cyan-blue gradient for window panes */}
                  <linearGradient id="hero-pane-tl" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7dd3fc" />
                    <stop offset="60%" stopColor="#0284c7" />
                    <stop offset="100%" stopColor="#0369a1" />
                  </linearGradient>
                  <linearGradient id="hero-pane-tr" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#bae6fd" />
                    <stop offset="70%" stopColor="#0284c7" />
                    <stop offset="100%" stopColor="#075985" />
                  </linearGradient>
                  <linearGradient id="hero-pane-bl" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="60%" stopColor="#0369a1" />
                    <stop offset="100%" stopColor="#082f49" />
                  </linearGradient>
                  <linearGradient id="hero-pane-br" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="65%" stopColor="#0284c7" />
                    <stop offset="100%" stopColor="#0c4a6e" />
                  </linearGradient>

                  <filter id="hero-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Pane 1 (Top Left) */}
                <path
                  d="M 15 30 L 92 18 L 92 92 L 15 92 Z"
                  fill="url(#hero-pane-tl)"
                  filter="url(#hero-glow)"
                  className="transition duration-300"
                />
                {/* Pane 2 (Top Right) */}
                <path
                  d="M 104 16 L 185 4 L 185 92 L 104 92 Z"
                  fill="url(#hero-pane-tr)"
                  filter="url(#hero-glow)"
                />
                {/* Pane 3 (Bottom Left) */}
                <path
                  d="M 15 104 L 92 104 L 92 178 L 15 166 Z"
                  fill="url(#hero-pane-bl)"
                  filter="url(#hero-glow)"
                />
                {/* Pane 4 (Bottom Right) */}
                <path
                  d="M 104 104 L 185 104 L 185 192 L 104 180 Z"
                  fill="url(#hero-pane-br)"
                  filter="url(#hero-glow)"
                />

                {/* Inner Bevel Light Lines */}
                <path d="M 17 32 L 90 20" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none" />
                <path d="M 106 18 L 183 6" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" fill="none" />
                <path d="M 17 106 L 90 106" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
                <path d="M 106 106 L 183 106" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
              </svg>
            </div>

            {/* Subtle Horizon Light Bar */}
            <div className="absolute w-[80%] h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent bottom-1/3" />
          </div>
        </div>
      );

    case 'bloom-light':
      return (
        <div className="absolute inset-0 bg-[#e8eef8] overflow-hidden">
          {/* Ethereal light background */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 45%, #ffffff 0%, #f0f4fa 45%, #d9e4f2 100%)'
            }}
          />

          {/* Light Bloom Flower Ribbon Art */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Ambient Bloom Glow */}
            <div className="absolute w-[700px] h-[550px] bg-gradient-to-tr from-sky-200 via-blue-200 to-indigo-100 rounded-full blur-[90px] opacity-80" />

            <svg
              width="680"
              height="580"
              viewBox="0 0 600 500"
              className="relative z-10 drop-shadow-[0_20px_40px_rgba(56,189,248,0.25)]"
            >
              <defs>
                <linearGradient id="bl-petal-1" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#e0f2fe" />
                </linearGradient>
                <linearGradient id="bl-petal-2" x1="100%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#0369a1" />
                  <stop offset="60%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#dbeafe" />
                </linearGradient>
                <linearGradient id="bl-petal-3" x1="30%" y1="0%" x2="70%" y2="100%">
                  <stop offset="0%" stopColor="#f0f9ff" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                <linearGradient id="bl-petal-4" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#bae6fd" />
                </linearGradient>
              </defs>

              {/* Sculpted layered petals forming the Windows 11 Bloom */}
              <g transform="translate(30, 20)">
                {/* Back Petals */}
                <path
                  d="M 280 340 C 220 370 140 330 130 260 C 120 180 200 130 260 160 C 310 180 320 280 280 340 Z"
                  fill="url(#bl-petal-1)"
                  opacity="0.85"
                />
                <path
                  d="M 320 350 C 400 370 480 320 470 240 C 460 170 390 140 330 170 C 280 200 290 290 320 350 Z"
                  fill="url(#bl-petal-2)"
                  opacity="0.9"
                />

                {/* Central Flow Petals */}
                <path
                  d="M 250 360 C 180 320 160 220 220 170 C 280 120 350 140 370 200 C 390 270 330 350 250 360 Z"
                  fill="url(#bl-petal-3)"
                  opacity="0.95"
                />

                {/* Inner Fold Ribbons */}
                <path
                  d="M 270 310 C 230 290 220 230 260 200 C 300 170 340 190 350 230 C 360 270 320 310 270 310 Z"
                  fill="url(#bl-petal-4)"
                />

                {/* Crisp front accent ribbon */}
                <path
                  d="M 280 270 C 260 250 270 210 290 200 C 320 190 340 220 330 250 C 320 280 290 280 280 270 Z"
                  fill="#ffffff"
                  opacity="0.75"
                />
              </g>
            </svg>
          </div>
        </div>
      );

    case 'bliss-modern':
      return (
        <div className="absolute inset-0 bg-[#3b82f6] overflow-hidden">
          {/* Azure Windows XP Sky */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, #1d4ed8 0%, #38bdf8 45%, #93c5fd 65%, #dbeafe 72%)'
            }}
          />

          {/* Cumulus Clouds */}
          <div className="absolute top-12 left-1/4 w-96 h-28 bg-white/70 rounded-full blur-xl" />
          <div className="absolute top-20 right-1/4 w-80 h-24 bg-white/60 rounded-full blur-xl" />
          <div className="absolute top-6 right-12 w-64 h-20 bg-white/50 rounded-full blur-lg" />

          {/* Rolling Green Hills of Bliss */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Background Hill */}
            <div
              className="absolute -bottom-20 -left-20 w-[120%] h-[55%] rounded-[100%_120%_0_0]"
              style={{
                background: 'linear-gradient(to bottom, #22c55e 0%, #16a34a 40%, #15803d 100%)',
                boxShadow: 'inset 0 10px 30px rgba(255,255,255,0.3)'
              }}
            />

            {/* Middle Sunlit Hill */}
            <div
              className="absolute -bottom-28 right-0 w-[85%] h-[50%] rounded-[120%_80%_0_0]"
              style={{
                background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 35%, #15803d 100%)',
                boxShadow: 'inset 0 15px 35px rgba(255,255,255,0.4)'
              }}
            />

            {/* Foreground Hill */}
            <div
              className="absolute -bottom-36 -left-10 w-[75%] h-[48%] rounded-[90%_130%_0_0]"
              style={{
                background: 'linear-gradient(110deg, #86efac 0%, #22c55e 30%, #166534 100%)',
                boxShadow: 'inset 0 15px 40px rgba(255,255,255,0.5)'
              }}
            />
          </div>
        </div>
      );

    case 'synthwave':
      return (
        <div className="absolute inset-0 bg-[#0c051f] overflow-hidden">
          {/* Retro Sun */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-gradient-to-t from-amber-500 via-rose-500 to-fuchsia-600 shadow-[0_0_80px_rgba(244,63,94,0.6)]" />
          {/* Horizon Grid */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1/2 opacity-40"
            style={{
              backgroundImage: 'linear-gradient(to bottom, transparent, rgba(236,72,153,0.3)), linear-gradient(rgba(236,72,153,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(236,72,153,0.5) 1px, transparent 1px)',
              backgroundSize: '100% 100%, 40px 40px, 40px 40px',
              transform: 'perspective(300px) rotateX(60deg)',
              transformOrigin: 'bottom'
            }}
          />
        </div>
      );

    case 'cyber-grid':
      return (
        <div className="absolute inset-0 bg-black overflow-hidden">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        </div>
      );

    case 'bloom-dark':
    default:
      return (
        <div className="absolute inset-0 bg-[#040817] overflow-hidden">
          {/* Deep Navy/Black Studio Vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 70% 65% at 50% 50%, #081738 0%, #050d24 50%, #020510 100%)'
            }}
          />

          {/* Central Windows 11 Signature Bloom Fabric Flower */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Ambient Volumetric Glow Behind the Bloom */}
            <div className="absolute w-[620px] h-[520px] bg-blue-600/30 rounded-full blur-[120px]" />
            <div className="absolute w-[450px] h-[400px] bg-sky-500/25 rounded-full blur-[80px]" />
            <div className="absolute w-[300px] h-[300px] bg-indigo-500/35 rounded-full blur-[60px]" />

            {/* High-Fidelity Windows 11 Bloom Ribbon Petals SVG */}
            <svg
              width="720"
              height="620"
              viewBox="0 0 700 600"
              className="relative z-10 drop-shadow-[0_25px_60px_rgba(2,132,199,0.4)] animate-in fade-in zoom-in-95 duration-700"
            >
              <defs>
                {/* Cobalt & Royal Blue Silk Petal Gradients */}
                <linearGradient id="bloom-deep-left" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0f172a" />
                  <stop offset="35%" stopColor="#1e3a8a" />
                  <stop offset="70%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>

                <linearGradient id="bloom-deep-right" x1="100%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#082f49" />
                  <stop offset="30%" stopColor="#1d4ed8" />
                  <stop offset="75%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>

                <linearGradient id="bloom-center-curl" x1="20%" y1="80%" x2="80%" y2="20%">
                  <stop offset="0%" stopColor="#1e1b4b" />
                  <stop offset="40%" stopColor="#2563eb" />
                  <stop offset="75%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#bae6fd" />
                </linearGradient>

                <linearGradient id="bloom-top-petal" x1="50%" y1="100%" x2="50%" y2="0%">
                  <stop offset="0%" stopColor="#1e40af" />
                  <stop offset="60%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#93c5fd" />
                </linearGradient>

                <linearGradient id="bloom-swirl-fold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="50%" stopColor="#1d4ed8" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>

                <filter id="bloom-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#020617" floodOpacity="0.8" />
                </filter>
              </defs>

              <g transform="translate(25, 20)">
                {/* Base Outer Petal 1 (Bottom Left Sweep) */}
                <path
                  d="M 330 430 C 220 460 120 410 90 320 C 60 210 160 140 240 180 C 310 215 320 340 330 430 Z"
                  fill="url(#bloom-deep-left)"
                  filter="url(#bloom-shadow)"
                />

                {/* Base Outer Petal 2 (Bottom Right Sweep) */}
                <path
                  d="M 350 440 C 470 465 570 395 580 295 C 590 185 490 135 410 170 C 340 200 340 330 350 440 Z"
                  fill="url(#bloom-deep-right)"
                  filter="url(#bloom-shadow)"
                />

                {/* Top Center Main Petal (Curving Crest) */}
                <path
                  d="M 280 220 C 230 130 320 60 410 80 C 490 100 520 200 450 260 C 390 310 320 280 280 220 Z"
                  fill="url(#bloom-top-petal)"
                  filter="url(#bloom-shadow)"
                />

                {/* Middle Left Twisted Ribbon */}
                <path
                  d="M 220 360 C 150 310 160 200 240 160 C 310 125 380 180 390 260 C 400 330 310 400 220 360 Z"
                  fill="url(#bloom-center-curl)"
                  filter="url(#bloom-shadow)"
                />

                {/* Middle Right Fold */}
                <path
                  d="M 440 370 C 510 320 500 210 420 170 C 350 135 300 200 320 290 C 340 360 400 390 440 370 Z"
                  fill="url(#bloom-swirl-fold)"
                />

                {/* Center Core Petals with Highlights */}
                <path
                  d="M 320 380 C 260 340 270 250 330 220 C 380 190 420 230 410 290 C 400 340 360 390 320 380 Z"
                  fill="url(#bloom-center-curl)"
                />

                {/* Front Radiant Light Ribbon Fold */}
                <path
                  d="M 310 320 C 280 290 290 230 335 215 C 375 200 395 240 380 285 C 365 320 330 335 310 320 Z"
                  fill="#60a5fa"
                  opacity="0.85"
                />

                <path
                  d="M 330 280 C 315 260 325 225 345 220 C 370 215 380 240 370 265 C 360 285 340 290 330 280 Z"
                  fill="#bae6fd"
                  opacity="0.9"
                />

                {/* Subtle Micro-Specularity */}
                <ellipse cx="348" cy="235" rx="14" ry="7" fill="#ffffff" opacity="0.6" transform="rotate(-25 348 235)" />
              </g>
            </svg>
          </div>
        </div>
      );
  }
};
