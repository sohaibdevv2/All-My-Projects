/**
 * Player Progress Types
 */
export interface PlayerProgress {
  level: number;
  experience: number;
  experienceToNextLevel: number;
  totalPlayTime: number; // in seconds
  lastSessionDate: Date;
}

/**
 * Skill Types
 */
export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: number;
  maxLevel: number;
  experience: number;
  experienceToNextLevel: number;
  unlockedAt?: Date;
  isUnlocked: boolean;
  prerequisites: string[]; // skill IDs
}

/**
 * Story Stage Types
 */
export interface StoryStage {
  id: string;
  title: string;
  description: string;
  chapter: number;
  isCompleted: boolean;
  completedAt?: Date;
  rewards: {
    experience: number;
    skillUnlocks: string[];
  };
  requiredSkillLevel?: {
    skillId: string;
    level: number;
  }[];
}

/**
 * Game State Types
 */
export interface GameState {
  progress: PlayerProgress;
  skills: Skill[];
  storyStages: StoryStage[];
  currentStoryStage: string | null;
}
