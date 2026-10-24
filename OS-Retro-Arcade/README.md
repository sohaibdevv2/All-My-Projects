# 🪟 Windows 11 Retro Arcade

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A high-fidelity **Windows 11 Fluent web desktop experience** featuring four fully-playable retro arcade games, complete window management with Windows 11 Snap Layouts, customizable wallpapers, and a synthesized Web Audio FX engine.

---

## 🎮 Built-in Retro Arcade Games

| Game | Description | Key Features |
| :--- | :--- | :--- |
| **🍄 Super Mario Bros Arcade** | 2D Canvas platformer inspired by the NES classic | Momentum physics, walking Goombas to stomp, mystery `?` blocks, Super Mushrooms (Mario doubles in height), destructible brown brick blocks, warp pipes, and end-of-stage flagpole animation. |
| **🏎️ Turbo Nitro Highway Racer** | High-speed 80s highway endurance racer | Dynamic multi-lane traffic (civilian sedans, semi-trucks, police cruisers), active speedometer (up to 260 km/h), nitro boost gauge, oil slick hazards, and chassis repair kits. |
| **👾 Galaxy Invader 1982** | Faithful arcade Space Invaders recreation | 5 marching alien rows with accelerating tempo, 4 destructible defense bunkers that erode from blaster fire, mystery flying red UFO, and wave progression. |
| **🐍 Neon Snake 3310** | Classic arcade snake with retro aesthetics | Standard apples, timed bonus golden stars, authentic green CRT Phosphor raster scanline mode, and high-score tracking. |

---

## 💻 Windows 11 Desktop Features

- **Fluent Taskbar & System Tray**: Centered taskbar with the 4-tile Fluent Start button, search, task view, running app indicator pills, live clock & date, quick settings pill, and right-edge show desktop peek.
- **Fluent Start Menu**: Floating frosted acrylic panel with real-time app search, pinned retro games, recommended high score cards, and user profile with power options.
- **Action Center & Quick Settings**: Fast toggles for Wi-Fi simulation, Audio FX, Retro CRT Scanlines, volume & brightness sliders, and an interactive monthly calendar.
- **Window Management & Snap Layouts**:
  - Drag-and-drop window repositioning with pointer capture.
  - Bottom-right corner resize handles.
  - Minimize, maximize/restore, and z-index active window layering.
  - **Windows 11 Snap Layouts**: Hover over the maximize button to pop up the snap menu and split windows 50/50 left or right, or maximize to full screen.
- **Personalization & Wallpapers**: 5 dynamic wallpapers:
  - *Windows 11 Bloom Dark*
  - *Windows 11 Bloom Light*
  - *Radical 80s Synthwave*
  - *Bliss 2026 Remaster*
  - *Matrix Cyber Grid*
- **Built-in System Apps**:
  - **Arcade Game Pass Hub**: Game launcher cards, controls overview, and Hall of Fame scoreboard.
  - **File Explorer**: Browse `Local Disk (C:) > Arcade Games` and launch `.exe` files.
  - **Notepad**: Browse and edit secret cheat codes and strategies with copy-to-clipboard.
  - **Calculator**: Standard arithmetic calculator with history log.
  - **Settings**: Customize wallpapers, toggle sound effects, enable CRT scanlines, and reset scores.

---

## 🔊 Synthesized Web Audio Engine

No external `.mp3` or `.wav` files are needed! All audio effects are synthesized in real time using the browser's native **Web Audio API**:
- **Windows 11 Chime**: Multi-voice harmonic startup chime.
- **Mario Effects**: Jumping oscillator, coin chime, enemy stomp, bump brick sound, powerup arpeggio.
- **Racing Sounds**: Engine RPM pitch frequency shift, tire screeches, nitro boost sweep, and crash noise decay.
- **Space Invaders**: Square-wave lasers, low-frequency 4-step marching cadence, and bunker hits.
- **Snake**: Sine wave collection blip.
- Master volume control, mute switch, and graceful audio context resumption.

---

## 🕹️ Controls Guide

### Super Mario Bros
- **Move Left / Right**: `A` / `D` or `Left` / `Right` Arrow
- **Jump**: `W` or `Up` Arrow or `Space`
- **Sprint / Fire**: `Shift` or `J`
- **Restart**: `R`
- *On-screen touch controls available on mobile & tablet.*

### Turbo Nitro Highway Racer
- **Steer**: `A` / `D` or `Left` / `Right` Arrow
- **Accelerate / Brake**: `W` / `S` or `Up` / `Down` Arrow
- **Nitro Boost**: `Space` or `Shift`
- **Restart**: `R`

### Galaxy Invader 1982
- **Move Cannon**: `A` / `D` or `Left` / `Right` Arrow
- **Fire Laser**: `Space`
- **Restart**: `R`

### Neon Snake 3310
- **Change Direction**: `W` `A` `S` `D` or Arrow Keys
- **Restart**: `R`

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or higher recommended)
- `npm`, `pnpm`, or `bun`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/windows-11-retro-arcade.git
   cd windows-11-retro-arcade
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```
   The production-ready static bundle will be compiled into the `dist/` directory.

5. **Preview production build locally**:
   ```bash
   npm run preview
   ```

---

## 📁 Project Structure

```text
├── public/
│   └── favicon.svg               # Windows 11 Fluent vector favicon
├── src/
│   ├── components/
│   │   ├── actioncenter/
│   │   │   └── ActionCenter.tsx  # Quick settings & calendar popover
│   │   ├── apps/
│   │   │   ├── ArcadeHubApp.tsx  # Game launcher & high scores hub
│   │   │   ├── CalculatorApp.tsx # Standard arithmetic calculator
│   │   │   ├── FileExplorerApp.tsx # Windows 11 file explorer
│   │   │   ├── NotepadApp.tsx    # Cheat codes editor with copy
│   │   │   └── SettingsApp.tsx   # Personalization & audio settings
│   │   ├── desktop/
│   │   │   └── Desktop.tsx       # Desktop grid, context menu & wallpapers
│   │   ├── games/
│   │   │   ├── CarRacingGame.tsx # Turbo Nitro Highway Racer
│   │   │   ├── MarioGame.tsx     # Super Mario Bros Arcade
│   │   │   ├── SnakeGame.tsx     # Neon Snake 3310
│   │   │   └── SpaceInvadersGame.tsx # Galaxy Invader 1982
│   │   ├── startmenu/
│   │   │   └── StartMenu.tsx     # Windows 11 Start Menu
│   │   ├── taskbar/
│   │   │   └── Taskbar.tsx       # Taskbar, app pills, clock & widgets
│   │   └── window/
│   │       └── WindowFrame.tsx   # Window dragging, resizing & Snap layouts
│   ├── utils/
│   │   └── audio.ts              # Web Audio API sound synthesizer
│   ├── App.tsx                   # Main state & window manager
│   ├── index.css                 # Tailwind CSS entry
│   ├── main.tsx                  # React DOM root entry
│   └── types.ts                  # Shared TypeScript interfaces & types
├── index.html                    # HTML5 entry with OpenGraph metadata
├── metadata.json                 # AI Studio applet configuration
├── package.json                  # Dependencies, scripts & repository info
├── tsconfig.json                 # TypeScript compiler configuration
└── vite.config.ts                # Vite & Tailwind CSS plugins
```

---

## 🚢 Deployment

Since this project builds into a pure client-side static bundle, it can be deployed to any static hosting provider:

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
- Build command: `npm run build`
- Publish directory: `dist`

### GitHub Pages
1. Install `gh-pages`: `npm install -D gh-pages`
2. Add `"deploy": "gh-pages -d dist"` to `scripts` in `package.json`
3. In `vite.config.ts`, set `base: './'` for relative asset links.
4. Run `npm run build && npm run deploy`

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
