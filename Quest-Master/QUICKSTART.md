# Quick Start Guide

## 🚀 Get the App Running

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

## 📝 Quick API Overview

### Import the Store

```typescript
import { useGameStore } from '@/store/gameStore';
```

### Common Tasks

#### Add Experience to Player
```typescript
const { addExperience } = useGameStore();
addExperience(100); // Player gains 100 XP
```

#### Unlock a Skill
```typescript
const { unlockSkill } = useGameStore();
unlockSkill('parry'); // Unlock the parry skill
```

#### Level Up a Skill
```typescript
const { addSkillExperience } = useGameStore();
addSkillExperience('slash', 50); // Add 50 XP to slash skill
```

#### Complete a Story Stage
```typescript
const { completeStoryStage } = useGameStore();
completeStoryStage('stage-1'); // Complete stage 1
// This automatically awards XP and unlocks skills
```

#### Get All Unlocked Skills
```typescript
const { getUnlockedSkills } = useGameStore();
const skills = getUnlockedSkills();
skills.forEach(skill => {
  console.log(`${skill.name}: Level ${skill.level}`);
});
```

#### Get Current Progress
```typescript
const { progress } = useGameStore();
console.log(`Player Level: ${progress.level}`);
console.log(`Current XP: ${progress.experience}/${progress.experienceToNextLevel}`);
console.log(`Total Playtime: ${Math.floor(progress.totalPlayTime / 60)}m`);
```

#### Reset Everything
```typescript
const { resetGame } = useGameStore();
resetGame(); // Back to initial state
```

## 🎨 Building a New Component

Here's a template for creating a new game component:

```typescript
'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export function MyNewComponent() {
  // Get what you need from the store
  const { progress, skills, addExperience } = useGameStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
    >
      <h2>My Game Component</h2>
      <p>Level: {progress.level}</p>
      <button
        onClick={() => addExperience(25)}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
      >
        Gain XP
      </button>
    </motion.div>
  );
}
```

## 🔧 Customizing Initial Data

Edit `src/store/gameStore.ts` to:

1. **Add Skills** - Modify the `skills` array in `initialGameState`
2. **Add Story Stages** - Modify the `storyStages` array
3. **Change Progression** - Adjust multipliers in experience calculations:
   - Player level-up: `experienceToNextLevel * 1.15` (line ~105)
   - Skill level-up: `experienceToNextLevel * 1.2` (line ~155)

## 📚 File Reference

| File | Purpose |
|------|---------|
| `src/store/gameStore.ts` | Zustand store with all game logic |
| `src/types/index.ts` | TypeScript interfaces |
| `src/components/PlayerProgressCard.tsx` | Player level & XP display |
| `src/components/SkillsPanel.tsx` | Skill management UI |
| `src/components/StoryStagesList.tsx` | Story progression UI |
| `src/hooks/usePersistentGameState.ts` | Auto-save hook |
| `src/lib/storage.ts` | LocalStorage utilities |
| `src/app/page.tsx` | Main page assembling all components |

## 💡 Pro Tips

1. **Watch State Changes**: Use the Framer Motion `animate` prop with state dependencies
2. **Prevent Re-renders**: Use Zustand's `useShallow` for specific state slices
3. **Debug State**: Check browser → DevTools → Application → LocalStorage → game_state
4. **Test Quickly**: Use the demo buttons in PlayerProgressCard to test
5. **Smooth Animations**: Most progress bars use 0.5s duration transitions

## 🐛 Troubleshooting

**State not persisting?**
- Check browser LocalStorage settings (not in private mode)
- Clear LocalStorage and reload to reset

**Animations stuttering?**
- Check browser performance (DevTools → Performance)
- Reduce number of animated items if needed

**Component not updating?**
- Make sure you have `'use client'` at the top
- Verify you're using the store hook correctly
- Check that the component renders in a client component

---

**Need help?** Check the full README.md for detailed documentation! 📖
