# Advanced Usage Examples

This file contains advanced patterns and examples for using the Quest Master game system.

## Advanced Store Patterns

### Subscribing to State Changes

```typescript
import { useGameStore } from '@/store/gameStore';

// Subscribe to specific state changes
useEffect(() => {
  const unsubscribe = useGameStore.subscribe(
    (state) => state.progress.level,
    (newLevel, oldLevel) => {
      console.log(`Level up! New level: ${newLevel}`);
      // Play level-up animation or sound
    }
  );

  return unsubscribe;
}, []);
```

### Creating Computed Selectors

```typescript
import { useGameStore } from '@/store/gameStore';

// Get total skill points across all skills
const getTotalSkillPoints = (state) => {
  return state.skills.reduce((total, skill) => {
    return total + skill.level;
  }, 0);
};

const totalSkillPoints = useGameStore(getTotalSkillPoints);
```

### Bulk Operations

```typescript
// Complete multiple stages and gather all rewards
const completeChapter = (chapterNumber) => {
  const { storyStages, completeStoryStage } = useGameStore.getState();
  
  const chaptersStages = storyStages.filter(s => s.chapter === chapterNumber);
  chaptersStages.forEach(stage => {
    if (!stage.isCompleted) {
      completeStoryStage(stage.id);
    }
  });
};
```

## Creating Custom Hooks

### useLevelProgress Hook

```typescript
// src/hooks/useLevelProgress.ts
'use client';
import { useGameStore } from '@/store/gameStore';

export function useLevelProgress() {
  const progress = useGameStore((state) => state.progress);
  
  const percentToNextLevel = 
    (progress.experience / progress.experienceToNextLevel) * 100;
  
  return {
    currentLevel: progress.level,
    currentXP: progress.experience,
    xpNeeded: progress.experienceToNextLevel,
    percentProgress: percentToNextLevel,
    isLevelingUp: progress.experience >= progress.experienceToNextLevel,
  };
}
```

Usage:
```typescript
const { currentLevel, percentProgress } = useLevelProgress();
```

### useSkillProgression Hook

```typescript
// src/hooks/useSkillProgression.ts
'use client';
import { useGameStore } from '@/store/gameStore';

export function useSkillProgression(skillId: string) {
  const skill = useGameStore((state) => 
    state.skills.find(s => s.id === skillId)
  );
  
  if (!skill) return null;
  
  return {
    ...skill,
    percentToNextLevel: (skill.experience / skill.experienceToNextLevel) * 100,
    isMaxLevel: skill.level >= skill.maxLevel,
  };
}
```

### useStoryProgress Hook

```typescript
// src/hooks/useStoryProgress.ts
'use client';
import { useGameStore } from '@/store/gameStore';

export function useStoryProgress() {
  const state = useGameStore();
  
  const completed = state.getCompletedStages();
  const available = state.getAvailableStages();
  const currentStage = state.storyStages.find(
    s => s.id === state.currentStoryStage
  );
  
  return {
    currentStage,
    completedCount: completed.length,
    totalCount: state.storyStages.length,
    percentComplete: (completed.length / state.storyStages.length) * 100,
    availableStages: available,
  };
}
```

## Advanced Component Patterns

### Achievement System

```typescript
'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

interface Achievement {
  id: string;
  title: string;
  description: string;
  condition: (state) => boolean;
  reward: () => void;
}

const achievements: Achievement[] = [
  {
    id: 'level-10',
    title: 'Adventurer',
    description: 'Reach level 10',
    condition: (state) => state.progress.level >= 10,
    reward: () => console.log('Level 10 reached!'),
  },
  {
    id: 'all-skills',
    title: 'Master',
    description: 'Unlock all skills',
    condition: (state) => state.skills.every(s => s.isUnlocked),
    reward: () => console.log('All skills unlocked!'),
  },
];

export function AchievementTracker() {
  const state = useGameStore();
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);

  useEffect(() => {
    achievements.forEach(achievement => {
      if (
        achievement.condition(state) &&
        !unlockedAchievements.includes(achievement.id)
      ) {
        setUnlockedAchievements(prev => [...prev, achievement.id]);
        achievement.reward();
      }
    });
  }, [state]);

  return (
    <div>
      <h3>Achievements</h3>
      {achievements.map(achievement => {
        const isUnlocked = unlockedAchievements.includes(achievement.id);
        return (
          <motion.div
            key={achievement.id}
            initial={isUnlocked ? { scale: 0 } : {}}
            animate={isUnlocked ? { scale: 1 } : {}}
            className={`p-4 rounded ${
              isUnlocked
                ? 'bg-gold-100 border-gold-500'
                : 'bg-gray-100 border-gray-300'
            }`}
          >
            <h4>{achievement.title}</h4>
            <p>{achievement.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
```

### Event Logger

```typescript
// src/hooks/useGameEvents.ts
'use client';
import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';

export function useGameEvents() {
  useEffect(() => {
    // Track level changes
    const unsubLevel = useGameStore.subscribe(
      (state) => state.progress.level,
      (newLevel) => {
        console.log(`📊 Player leveled up to ${newLevel}`);
      }
    );

    // Track skill unlocks
    const unsubSkills = useGameStore.subscribe(
      (state) => state.skills.filter(s => s.isUnlocked).length,
      (unlockedCount) => {
        console.log(`🔓 ${unlockedCount} skills unlocked`);
      }
    );

    // Track stage completion
    const unsubStages = useGameStore.subscribe(
      (state) => state.getCompletedStages().length,
      (completedCount) => {
        console.log(`✅ ${completedCount} stages completed`);
      }
    );

    return () => {
      unsubLevel();
      unsubSkills();
      unsubStages();
    };
  }, []);
}
```

## Statistics & Analytics

### Calculate Player Statistics

```typescript
export function getPlayerStats(state) {
  return {
    totalSkillPoints: state.skills.reduce(
      (sum, skill) => sum + (skill.isUnlocked ? skill.level : 0),
      0
    ),
    maxSkillPoints: state.skills.reduce(
      (sum, skill) => sum + skill.maxLevel,
      0
    ),
    storyCompletion: (state.getCompletedStages().length / state.storyStages.length) * 100,
    skillCompletion: (state.getUnlockedSkills().length / state.skills.length) * 100,
    averagePlaySession: state.progress.totalPlayTime > 0 ? 
      state.progress.totalPlayTime / 60 : 0, // hours
  };
}
```

### Time-based Rewards

```typescript
export function useDailyBonus() {
  const { progress, addExperience } = useGameStore();
  
  const lastSession = new Date(progress.lastSessionDate);
  const today = new Date();
  
  const isDifferentDay = 
    lastSession.toDateString() !== today.toDateString();

  useEffect(() => {
    if (isDifferentDay) {
      addExperience(50); // Daily bonus
      console.log('Daily bonus applied!');
    }
  }, [isDifferentDay]);

  return { isDifferentDay };
}
```

## Save/Load Management

### Export Game Data

```typescript
export function exportGameData() {
  const { saveGameState } = useGameStore.getState();
  const stateString = saveGameState();
  
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(stateString));
  element.setAttribute('download', 'quest-master-save.json');
  element.style.display = 'none';
  
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
```

### Import Game Data

```typescript
export function importGameData(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const { loadGameState } = useGameStore.getState();
        loadGameState(content);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.readAsText(file);
  });
}
```

---

These patterns show how to extend the base game system with more advanced features! 🚀
