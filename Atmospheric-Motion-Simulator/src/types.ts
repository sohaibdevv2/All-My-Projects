export interface Particle {
  id: string;
  type: 'snowflake' | 'balloon';
  startX: number;   // Horizontal position percentage (0 - 100)
  drift: number;    // Horizontal shift offset (-15 to +15 vw)
  size: number;     // Particle size (pixels) - medium range (e.g. 24px - 36px)
  duration: number; // Animation speed/duration (seconds)
  color?: string;   // For balloons (shades of festive jewel colors)
  rotate: number;   // For snowflakes rotation
}

export type ActiveEffect = 'snowflakes' | 'balloons' | null;
