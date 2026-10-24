export type AppId = 
  | 'mario'
  | 'racing'
  | 'invaders'
  | 'snake'
  | 'file-explorer'
  | 'settings'
  | 'notepad'
  | 'calculator'
  | 'arcade-hub'
  | 'recycle-bin';

export interface WindowInstance {
  id: string;
  appId: AppId;
  title: string;
  icon: string;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  prevRect?: { x: number; y: number; width: number; height: number };
  zIndex: number;
}

export interface AppConfig {
  id: AppId;
  name: string;
  icon: string;
  category: 'games' | 'system' | 'utilities';
  description: string;
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  minHeight: number;
  accentColor: string;
}

export type WallpaperId = 'bloom-dark' | 'bloom-light' | 'windows-hero' | 'bliss-modern' | 'synthwave' | 'cyber-grid';

export interface SystemSettings {
  theme: 'dark' | 'light';
  wallpaper: WallpaperId;
  soundEnabled: boolean;
  soundVolume: number;
  crtFilter: boolean;
}

export interface HighScores {
  mario: number;
  racing: number;
  invaders: number;
  snake: number;
}
