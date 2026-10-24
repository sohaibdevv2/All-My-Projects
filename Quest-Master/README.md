# Quest Master - React/Next.js Game App

A fully-featured game progression system built with Next.js, TypeScript, Tailwind CSS, and Framer Motion. This app demonstrates modern state management with Zustand and includes systems for player progress, skill development, and story progression.

## 🎮 Features

### Player Progress System
- **Level & Experience**: Track player levels with dynamic experience requirements
- **Playtime Tracking**: Monitor total playtime across sessions
- **Auto-Save**: State persists to browser localStorage automatically
- **Animated Progress Bars**: Smooth Framer Motion animations

### Skill Management
- **Skill Unlocking**: Unlock skills as you progress through the story
- **Skill Leveling**: Level up individual skills with prerequisite chains
- **Dynamic Requirements**: Skills can have prerequisites
- **Visual Skill Cards**: Beautiful animated skill displays with status indicators

### Story Progression
- **Chapter-Based Stages**: Organize story into chapters and stages
- **Stage Completion**: Mark stages as complete and earn rewards
- **Dynamic Rewards**: Automatically unlock skills and award experience
- **Completion Tracking**: Track player progress through the narrative

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with Tailwind styles
│   ├── page.tsx            # Main game page
│   └── globals.css         # Global styles with Tailwind
├── components/
│   ├── PlayerProgressCard.tsx   # Player stats & level display
│   ├── SkillsPanel.tsx          # Skill management UI
│   └── StoryStagesList.tsx      # Story progression UI
├── hooks/
│   └── usePersistentGameState.ts # localStorage persistence hook
├── lib/
│   └── storage.ts          # Storage utility functions
├── store/
│   └── gameStore.ts        # Zustand state management
└── types/
    └── index.ts            # TypeScript type definitions
```

## 🛠️ Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **State Management**: Zustand (lightweight alternative to Redux)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Storage**: Browser localStorage for persistence

## 📦 Installation & Setup

The project is already fully set up! Just install dependencies:

```bash
npm install
```

### Available Scripts

```bash
# Development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🎯 State Management Architecture

### Using Zustand Store

The game state is managed through a single Zustand store with clear action categories:

```typescript
import { useGameStore } from '@/store/gameStore';

// In any component:
const { 
  progress,      // Current player progress
  skills,        // Array of all skills
  storyStages,   // Array of all story stages
  addExperience, // Add XP to player
  unlockSkill,   // Unlock a skill
  completeStoryStage // Complete a stage
} = useGameStore();
```

### Key Store Features

1. **Player Progress Actions**
   - `addExperience(amount)` - Add experience points
   - `levelUp()` - Manually level up
   - `updatePlayTime(seconds)` - Add playtime

2. **Skill Actions**
   - `unlockSkill(skillId)` - Unlock a locked skill
   - `addSkillExperience(skillId, amount)` - Add skill XP
   - `levelUpSkill(skillId)` - Level up a skill
   - `getUnlockedSkills()` - Get all unlocked skills
   - `getLockedSkills()` - Get all locked skills

3. **Story Stage Actions**
   - `completeStoryStage(stageId)` - Mark stage as complete
   - `setCurrentStoryStage(stageId)` - Set active stage
   - `getCompletedStages()` - Get completed stages
   - `getAvailableStages()` - Get available stages

4. **Persistence**
   - `saveGameState()` - Serialize state to JSON
   - `loadGameState(state)` - Deserialize from JSON
   - `resetGame()` - Reset to initial state

### LocalStorage Persistence

The `usePersistentGameState` hook automatically:
- Loads saved state on component mount
- Saves state on every change
- Handles browser storage gracefully

```typescript
// In any page or component:
const { isLoaded } = usePersistentGameState();

if (!isLoaded) {
  return <LoadingScreen />;
}
```

## 🎨 Component Examples

### Using Player Progress

```typescript
'use client';
import { useGameStore } from '@/store/gameStore';

export function MyComponent() {
  const { progress, addExperience } = useGameStore();
  
  return (
    <div>
      <p>Level: {progress.level}</p>
      <p>XP: {progress.experience}/{progress.experienceToNextLevel}</p>
      <button onClick={() => addExperience(50)}>Earn 50 XP</button>
    </div>
  );
}
```

### Using Skills

```typescript
export function SkillComponent() {
  const { getUnlockedSkills, addSkillExperience } = useGameStore();
  const skills = getUnlockedSkills();
  
  return (
    <div>
      {skills.map(skill => (
        <div key={skill.id}>
          <h3>{skill.name} (Level {skill.level})</h3>
          <button onClick={() => addSkillExperience(skill.id, 25)}>
            Practice
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Using Story Stages

```typescript
export function StoryComponent() {
  const { storyStages, completeStoryStage } = useGameStore();
  
  return (
    <div>
      {storyStages.map(stage => (
        <div key={stage.id}>
          <h3>{stage.title}</h3>
          {!stage.isCompleted && (
            <button onClick={() => completeStoryStage(stage.id)}>
              Complete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

## 📊 Data Types

### GameState
```typescript
interface GameState {
  progress: PlayerProgress;
  skills: Skill[];
  storyStages: StoryStage[];
  currentStoryStage: string | null;
}
```

### PlayerProgress
```typescript
interface PlayerProgress {
  level: number;
  experience: number;
  experienceToNextLevel: number;
  totalPlayTime: number; // in seconds
  lastSessionDate: Date;
}
```

### Skill
```typescript
interface Skill {
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
```

### StoryStage
```typescript
interface StoryStage {
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
```

## 🎬 Framer Motion Animations

All components feature smooth animations:
- Page load animations with staggered children
- Hover effects on interactive elements
- Smooth progress bar transitions
- Level-up animations with scale transforms
- Fade-in transitions for delayed content

### Animation Patterns Used

1. **Container Variants** - Stagger animations for lists
2. **Item Variants** - Individual animations for list items
3. **Transition Effects** - Smooth easing functions
4. **Gesture Animations** - whileHover and whileTap

## 🚀 Customization Guide

### Adding a New Skill

```typescript
// In gameStore.ts initial state:
{
  id: 'lightning',
  name: 'Lightning Bolt',
  description: 'Harness the power of lightning',
  icon: '⚡',
  level: 0,
  maxLevel: 4,
  experience: 0,
  experienceToNextLevel: 100,
  isUnlocked: false,
  prerequisites: ['fireball'], // Requires fireball skill
}
```

### Adding a New Story Stage

```typescript
{
  id: 'stage-4',
  title: 'The Final Battle',
  description: 'Defeat the dark lord',
  chapter: 3,
  isCompleted: false,
  rewards: {
    experience: 1000,
    skillUnlocks: ['lightning'],
  },
  requiredSkillLevel: [
    { skillId: 'slash', level: 4 },
    { skillId: 'fireball', level: 2 },
  ],
}
```

### Tweaking Progression

All progression values can be adjusted in `gameStore.ts`:
- Experience multipliers for leveling
- Base experience requirements
- Skill level up scaling (currently 1.2x per level)
- Player level scaling (currently 1.15x per level)

## 🔄 Development Workflow

1. **Edit Store** (`src/store/gameStore.ts`) - Add/modify game logic
2. **Create Components** - Build UI in `src/components/`
3. **Use in Pages** - Import and use components in app pages
4. **Test State** - Use browser DevTools → Application → LocalStorage
5. **Deploy** - Push to production with `npm run build && npm start`

## 📱 Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support (localStorage available)

## 🎓 Learning Resources

This project demonstrates:
- ✅ Zustand for state management
- ✅ Custom React hooks
- ✅ TypeScript interfaces & types
- ✅ Framer Motion animations
- ✅ Tailwind CSS responsive design
- ✅ Next.js App Router
- ✅ Client-side persistence
- ✅ Component composition patterns

## 📝 License

This project is open source and available under the MIT License.

---

**Happy questing!** 🗡️✨
