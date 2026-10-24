import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { GameState, Skill, StoryStage, PlayerProgress } from '@/types';

interface GameStore extends GameState {
  // Player Progress Actions
  addExperience: (amount: number) => void;
  levelUp: () => void;
  updatePlayTime: (seconds: number) => void;
  
  // Skill Actions
  unlockSkill: (skillId: string) => void;
  addSkillExperience: (skillId: string, amount: number) => void;
  levelUpSkill: (skillId: string) => void;
  getUnlockedSkills: () => Skill[];
  getLockedSkills: () => Skill[];
  
  // Story Stage Actions
  completeStoryStage: (stageId: string) => void;
  setCurrentStoryStage: (stageId: string | null) => void;
  getCompletedStages: () => StoryStage[];
  getAvailableStages: () => StoryStage[];
  
  // Save/Load
  saveGameState: () => string;
  loadGameState: (state: string) => void;
  resetGame: () => void;
}

// Initial game state
const initialGameState: GameState = {
  progress: {
    level: 1,
    experience: 0,
    experienceToNextLevel: 100,
    totalPlayTime: 0,
    lastSessionDate: new Date(),
  },
  skills: [
    {
      id: 'slash',
      name: 'Basic Slash',
      description: 'Learn the fundamental sword technique',
      icon: '⚔️',
      level: 1,
      maxLevel: 5,
      experience: 0,
      experienceToNextLevel: 50,
      isUnlocked: true,
      unlockedAt: new Date(),
      prerequisites: [],
    },
    {
      id: 'parry',
      name: 'Parry',
      description: 'Defend against incoming attacks',
      icon: '🛡️',
      level: 0,
      maxLevel: 5,
      experience: 0,
      experienceToNextLevel: 75,
      isUnlocked: false,
      prerequisites: ['slash'],
    },
    {
      id: 'fireball',
      name: 'Fireball',
      description: 'Cast a powerful fire spell',
      icon: '🔥',
      level: 0,
      maxLevel: 3,
      experience: 0,
      experienceToNextLevel: 100,
      isUnlocked: false,
      prerequisites: [],
    },
    {
      id: 'heal',
      name: 'Heal',
      description: 'Restore health to yourself or allies',
      icon: '✨',
      level: 0,
      maxLevel: 4,
      experience: 0,
      experienceToNextLevel: 80,
      isUnlocked: false,
      prerequisites: [],
    },
  ],
  storyStages: [
    {
      id: 'stage-1',
      title: 'The Beginning',
      description: 'Learn basic combat techniques in the Training Ground',
      chapter: 1,
      isCompleted: false,
      rewards: {
        experience: 100,
        skillUnlocks: ['parry'],
      },
      requiredSkillLevel: [],
    },
    {
      id: 'stage-2',
      title: 'Forest Encounter',
      description: 'Venture into the Whispering Forest and defeat goblin scouts',
      chapter: 1,
      isCompleted: false,
      rewards: {
        experience: 250,
        skillUnlocks: ['fireball'],
      },
      requiredSkillLevel: [{ skillId: 'slash', level: 2 }],
    },
    {
      id: 'stage-3',
      title: 'The Dark Tower',
      description: 'Explore the mysterious tower and uncover its secrets',
      chapter: 2,
      isCompleted: false,
      rewards: {
        experience: 500,
        skillUnlocks: ['heal'],
      },
      requiredSkillLevel: [
        { skillId: 'slash', level: 3 },
        { skillId: 'fireball', level: 1 },
      ],
    },
  ],
  currentStoryStage: 'stage-1',
};

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialGameState,

    // Player Progress Actions
    addExperience: (amount: number) => {
      set((state) => {
        const newExperience = state.progress.experience + amount;
        const experienceToNextLevel = state.progress.experienceToNextLevel;

        if (newExperience >= experienceToNextLevel) {
          return {
            progress: {
              ...state.progress,
              level: state.progress.level + 1,
              experience: newExperience - experienceToNextLevel,
              experienceToNextLevel: Math.floor(
                experienceToNextLevel * 1.15
              ),
              lastSessionDate: new Date(),
            },
          };
        }

        return {
          progress: {
            ...state.progress,
            experience: newExperience,
            lastSessionDate: new Date(),
          },
        };
      });
    },

    levelUp: () => {
      set((state) => ({
        progress: {
          ...state.progress,
          level: state.progress.level + 1,
          experience: 0,
          experienceToNextLevel: Math.floor(
            state.progress.experienceToNextLevel * 1.15
          ),
        },
      }));
    },

    updatePlayTime: (seconds: number) => {
      set((state) => ({
        progress: {
          ...state.progress,
          totalPlayTime: state.progress.totalPlayTime + seconds,
        },
      }));
    },

    // Skill Actions
    unlockSkill: (skillId: string) => {
      set((state) => ({
        skills: state.skills.map((skill) =>
          skill.id === skillId
            ? {
                ...skill,
                isUnlocked: true,
                unlockedAt: new Date(),
                level: Math.max(skill.level, 1),
              }
            : skill
        ),
      }));
    },

    addSkillExperience: (skillId: string, amount: number) => {
      set((state) => ({
        skills: state.skills.map((skill) => {
          if (skill.id === skillId && skill.isUnlocked) {
            const newExperience = skill.experience + amount;
            const experienceToNextLevel = skill.experienceToNextLevel;

            if (
              newExperience >= experienceToNextLevel &&
              skill.level < skill.maxLevel
            ) {
              return {
                ...skill,
                level: skill.level + 1,
                experience: newExperience - experienceToNextLevel,
                experienceToNextLevel: Math.floor(
                  experienceToNextLevel * 1.2
                ),
              };
            }

            return {
              ...skill,
              experience: Math.min(newExperience, experienceToNextLevel),
            };
          }
          return skill;
        }),
      }));
    },

    levelUpSkill: (skillId: string) => {
      set((state) => ({
        skills: state.skills.map((skill) => {
          if (
            skill.id === skillId &&
            skill.isUnlocked &&
            skill.level < skill.maxLevel
          ) {
            return {
              ...skill,
              level: skill.level + 1,
              experience: 0,
              experienceToNextLevel: Math.floor(
                skill.experienceToNextLevel * 1.2
              ),
            };
          }
          return skill;
        }),
      }));
    },

    getUnlockedSkills: () => {
      return get().skills.filter((skill) => skill.isUnlocked);
    },

    getLockedSkills: () => {
      return get().skills.filter((skill) => !skill.isUnlocked);
    },

    // Story Stage Actions
    completeStoryStage: (stageId: string) => {
      const state = get();
      const stage = state.storyStages.find((s) => s.id === stageId);

      if (stage && !stage.isCompleted) {
        set((currentState) => ({
          storyStages: currentState.storyStages.map((s) =>
            s.id === stageId
              ? {
                  ...s,
                  isCompleted: true,
                  completedAt: new Date(),
                }
              : s
          ),
        }));

        // Award experience
        get().addExperience(stage.rewards.experience);

        // Unlock skills
        stage.rewards.skillUnlocks.forEach((skillId) => {
          get().unlockSkill(skillId);
        });
      }
    },

    setCurrentStoryStage: (stageId: string | null) => {
      set({ currentStoryStage: stageId });
    },

    getCompletedStages: () => {
      return get().storyStages.filter((stage) => stage.isCompleted);
    },

    getAvailableStages: () => {
      return get().storyStages.filter((stage) => !stage.isCompleted);
    },

    // Save/Load
    saveGameState: () => {
      const state = get();
      return JSON.stringify({
        progress: state.progress,
        skills: state.skills,
        storyStages: state.storyStages,
        currentStoryStage: state.currentStoryStage,
      });
    },

    loadGameState: (stateString: string) => {
      try {
        const loadedState = JSON.parse(stateString);
        set(loadedState);
      } catch (error) {
        console.error('Failed to load game state:', error);
      }
    },

    resetGame: () => {
      set(initialGameState);
    },
  }))
);
