/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppId, WindowInstance, SystemSettings, HighScores, WallpaperId } from './types';
import { sounds } from './utils/audio';

// Desktop & Shell
import { Desktop } from './components/desktop/Desktop';
import { Taskbar } from './components/taskbar/Taskbar';
import { StartMenu } from './components/startmenu/StartMenu';
import { ActionCenter } from './components/actioncenter/ActionCenter';
import { WindowFrame } from './components/window/WindowFrame';

// Games
import { MarioGame } from './components/games/MarioGame';
import { CarRacingGame } from './components/games/CarRacingGame';
import { SpaceInvadersGame } from './components/games/SpaceInvadersGame';
import { SnakeGame } from './components/games/SnakeGame';

// System & Utility Apps
import { ArcadeHubApp } from './components/apps/ArcadeHubApp';
import { FileExplorerApp } from './components/apps/FileExplorerApp';
import { SettingsApp } from './components/apps/SettingsApp';
import { NotepadApp } from './components/apps/NotepadApp';
import { CalculatorApp } from './components/apps/CalculatorApp';

const APP_METADATA: Record<AppId, { title: string; icon: string; width: number; height: number }> = {
  mario: { title: 'Super Mario Bros Arcade', icon: '🍄', width: 640, height: 550 },
  racing: { title: 'Turbo Nitro Highway Racer', icon: '🏎️', width: 440, height: 600 },
  invaders: { title: 'Galaxy Invader 1982', icon: '👾', width: 520, height: 580 },
  snake: { title: 'Neon Snake 3310', icon: '🐍', width: 440, height: 520 },
  'arcade-hub': { title: 'Arcade Game Pass', icon: '🎮', width: 720, height: 560 },
  'file-explorer': { title: 'File Explorer', icon: '📁', width: 680, height: 480 },
  settings: { title: 'Settings', icon: '⚙️', width: 650, height: 520 },
  notepad: { title: 'Arcade Cheat Codes - Notepad', icon: '📝', width: 540, height: 440 },
  calculator: { title: 'Calculator', icon: '🧮', width: 340, height: 460 },
  'recycle-bin': { title: 'Recycle Bin', icon: '🗑️', width: 500, height: 400 }
};

export default function App() {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [startMenuOpen, setStartMenuOpen] = useState<boolean>(false);
  const [actionCenterOpen, setActionCenterOpen] = useState<boolean>(false);
  const [maxZIndex, setMaxZIndex] = useState<number>(10);

  // Settings state
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('w11_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      theme: 'dark',
      wallpaper: 'bloom-dark',
      soundEnabled: true,
      soundVolume: 0.5,
      crtFilter: false
    };
  });

  // High scores state
  const [highScores, setHighScores] = useState<HighScores>(() => {
    const saved = localStorage.getItem('w11_highscores');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return { mario: 3200, racing: 1480, invaders: 950, snake: 400 };
  });

  // Save settings on update
  useEffect(() => {
    localStorage.setItem('w11_settings', JSON.stringify(settings));
    sounds.enabled = settings.soundEnabled;
    sounds.volume = settings.soundVolume;
  }, [settings]);

  // Save high scores on update
  useEffect(() => {
    localStorage.setItem('w11_highscores', JSON.stringify(highScores));
  }, [highScores]);

  // Bootup: open Arcade Hub and Mario initially for immediate user enjoyment!
  useEffect(() => {
    const isMobile = window.innerWidth < 640;
    const initialHubWidth = isMobile ? window.innerWidth - 20 : 700;
    const initialHubHeight = isMobile ? window.innerHeight - 80 : 540;

    const initialHub: WindowInstance = {
      id: 'window-arcade-hub',
      appId: 'arcade-hub',
      title: APP_METADATA['arcade-hub'].title,
      icon: APP_METADATA['arcade-hub'].icon,
      isMinimized: false,
      isMaximized: false,
      position: { x: Math.max(10, Math.floor((window.innerWidth - initialHubWidth) / 2)), y: 40 },
      size: { width: initialHubWidth, height: initialHubHeight },
      zIndex: 11
    };

    setWindows([initialHub]);
    setActiveWindowId('window-arcade-hub');
    setMaxZIndex(12);

    // Play pleasant startup sound after a tiny user gesture or delay
    const timer = setTimeout(() => {
      sounds.playStartupSound();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Bring window to focus
  const focusWindow = (id: string) => {
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);
    setActiveWindowId(id);
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, zIndex: nextZ, isMinimized: false } : w))
    );
  };

  // Open or focus an app
  const openApp = (appId: AppId) => {
    setStartMenuOpen(false);
    setActionCenterOpen(false);

    // Check if window is already open
    const existing = windows.find(w => w.appId === appId);
    if (existing) {
      focusWindow(existing.id);
      return;
    }

    const meta = APP_METADATA[appId] || { title: appId, icon: '🎮', width: 550, height: 450 };
    const isMobile = window.innerWidth < 640;
    const width = isMobile ? Math.min(window.innerWidth - 20, meta.width) : meta.width;
    const height = isMobile ? Math.min(window.innerHeight - 90, meta.height) : meta.height;

    // Center position with stagger offset
    const offset = (windows.length % 5) * 25;
    const posX = Math.max(10, Math.min(window.innerWidth - width - 10, Math.floor((window.innerWidth - width) / 2) + offset));
    const posY = Math.max(20, Math.min(window.innerHeight - height - 60, 40 + offset));

    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);

    const newWindow: WindowInstance = {
      id: `window-${appId}-${Date.now()}`,
      appId,
      title: meta.title,
      icon: meta.icon,
      isMinimized: false,
      isMaximized: false,
      position: { x: posX, y: posY },
      size: { width, height },
      zIndex: nextZ
    };

    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(newWindow.id);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const toggleMaximize = (id: string) => {
    setWindows(prev =>
      prev.map(w => {
        if (w.id !== id) return w;
        if (w.isMaximized) {
          // Restore
          return {
            ...w,
            isMaximized: false,
            position: w.prevRect ? { x: w.prevRect.x, y: w.prevRect.y } : w.position,
            size: w.prevRect ? { width: w.prevRect.width, height: w.prevRect.height } : w.size
          };
        } else {
          // Maximize
          return {
            ...w,
            isMaximized: true,
            prevRect: { ...w.position, ...w.size }
          };
        }
      })
    );
  };

  const snapWindow = (id: string, side: 'left' | 'right' | 'full') => {
    if (side === 'full') {
      toggleMaximize(id);
      return;
    }

    const halfW = Math.floor(window.innerWidth / 2);
    const h = window.innerHeight - 48;

    setWindows(prev =>
      prev.map(w => {
        if (w.id !== id) return w;
        return {
          ...w,
          isMaximized: false,
          position: { x: side === 'left' ? 0 : halfW, y: 0 },
          size: { width: halfW, height: h }
        };
      })
    );
  };

  const moveWindow = (id: string, pos: { x: number; y: number }) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, position: pos } : w))
    );
  };

  const resizeWindow = (id: string, size: { width: number; height: number }) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, size } : w))
    );
  };

  const handleShowDesktop = () => {
    const hasUnminimized = windows.some(w => !w.isMinimized);
    setWindows(prev =>
      prev.map(w => ({ ...w, isMinimized: hasUnminimized }))
    );
  };

  const updateHighScore = (game: keyof HighScores, newScore: number) => {
    setHighScores(prev => {
      if (newScore > prev[game]) {
        return { ...prev, [game]: newScore };
      }
      return prev;
    });
  };

  // Render individual app window content
  const renderAppContent = (win: WindowInstance) => {
    switch (win.appId) {
      case 'mario':
        return <MarioGame onScoreUpdate={(s) => updateHighScore('mario', s)} />;
      case 'racing':
        return <CarRacingGame onScoreUpdate={(s) => updateHighScore('racing', s)} />;
      case 'invaders':
        return <SpaceInvadersGame onScoreUpdate={(s) => updateHighScore('invaders', s)} />;
      case 'snake':
        return <SnakeGame onScoreUpdate={(s) => updateHighScore('snake', s)} />;
      case 'arcade-hub':
        return <ArcadeHubApp onLaunchGame={openApp} highScores={highScores} />;
      case 'file-explorer':
        return <FileExplorerApp onLaunchGame={openApp} />;
      case 'settings':
        return (
          <SettingsApp
            settings={settings}
            onUpdateSettings={(ns) => setSettings(prev => ({ ...prev, ...ns }))}
            onResetScores={() => setHighScores({ mario: 0, racing: 0, invaders: 0, snake: 0 })}
          />
        );
      case 'notepad':
        return <NotepadApp />;
      case 'calculator':
        return <CalculatorApp />;
      default:
        return (
          <div className="flex items-center justify-center h-full bg-slate-900 text-slate-400 text-sm">
            App placeholder
          </div>
        );
    }
  };

  return (
    <Desktop
      wallpaper={settings.wallpaper}
      crtFilter={settings.crtFilter}
      onLaunchApp={openApp}
      onOpenSettings={() => openApp('settings')}
      onChangeWallpaper={(nextWp) => setSettings(s => ({ ...s, wallpaper: nextWp }))}
    >
      {/* Active Windows Layer */}
      {windows.map(win => (
        <WindowFrame
          key={win.id}
          window={win}
          onFocus={focusWindow}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onToggleMaximize={toggleMaximize}
          onSnap={snapWindow}
          onMove={moveWindow}
          onResize={resizeWindow}
        >
          {renderAppContent(win)}
        </WindowFrame>
      ))}

      {/* Start Menu */}
      <StartMenu
        isOpen={startMenuOpen}
        onClose={() => setStartMenuOpen(false)}
        onLaunchApp={openApp}
        highScores={highScores}
      />

      {/* Action Center & Quick Settings */}
      <ActionCenter
        isOpen={actionCenterOpen}
        onClose={() => setActionCenterOpen(false)}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }))}
        soundVolume={settings.soundVolume}
        onChangeVolume={(vol) => setSettings(s => ({ ...s, soundVolume: vol }))}
        crtFilter={settings.crtFilter}
        onToggleCrt={() => setSettings(s => ({ ...s, crtFilter: !s.crtFilter }))}
      />

      {/* Windows 11 Taskbar */}
      <Taskbar
        windows={windows}
        activeWindowId={activeWindowId}
        startMenuOpen={startMenuOpen}
        onToggleStartMenu={() => {
          setActionCenterOpen(false);
          setStartMenuOpen(prev => !prev);
        }}
        actionCenterOpen={actionCenterOpen}
        onToggleActionCenter={() => {
          setStartMenuOpen(false);
          setActionCenterOpen(prev => !prev);
        }}
        onAppClick={openApp}
        onShowDesktop={handleShowDesktop}
        soundEnabled={settings.soundEnabled}
      />
    </Desktop>
  );
}
