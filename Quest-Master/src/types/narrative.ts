/**
 * Narrative Engine Types
 * Represents branching narrative, choices, and outcomes
 */

export interface NarrativeChoice {
  id: string;
  text: string;
  nextNodeId: string;
  outcomes?: {
    accomplishments?: string[];
    techBadges?: string[];
    projects?: string[];
    xpReward?: number;
  };
}

export interface NarrativeNode {
  id: string;
  title: string;
  text: string;
  choices: NarrativeChoice[];
  isEnding?: boolean;
  endingType?: 'success' | 'pivot' | 'specialization';
}

export interface CareerAccomplishment {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  isUnlocked: boolean;
}

export interface TechBadge {
  id: string;
  name: string;
  description: string;
  category: 'frontend' | 'backend' | 'devops' | 'database' | 'tools' | 'methodology';
  icon: string;
  unlockedAt?: Date;
  isUnlocked: boolean;
}

export interface ProjectHighlight {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  icon: string;
  unlockedAt?: Date;
  isUnlocked: boolean;
  impact?: string;
}

export interface NarrativeState {
  currentNodeId: string;
  visitedNodes: string[];
  unlockedAccomplishments: CareerAccomplishment[];
  unlockedBadges: TechBadge[];
  unlockedProjects: ProjectHighlight[];
  narrativeStarted: boolean;
  narrativeEnded: boolean;
  endingType?: 'success' | 'pivot' | 'specialization';
}
