# Narrative Engine Documentation

## 🚀 Overview

The Narrative Engine is an interactive, branching story system that guides users through a career journey. Users make choices that unlock career accomplishments, tech stack badges, and portfolio projects. It's a perfect complement to the Quest Master game system for showcasing career progression and skill development.

## 📖 How It Works

### Story Structure
The narrative is built as a directed graph of story **nodes** connected by **choices**. Each choice leads to a new node and can have **outcomes** that unlock achievements.

```
Start Node
├─ Choice 1 → Frontend Path
│  ├─ Choice 1a → React Expert
│  └─ Choice 1b → Design Specialist
└─ Choice 2 → Backend Path
   ├─ Choice 2a → Python Expert
   └─ Choice 2b → DevOps Engineer
```

## 📂 File Structure

```
src/
├── types/
│   └── narrative.ts              # TypeScript interfaces
├── store/
│   └── narrativeStore.ts         # Zustand store (800+ lines of story)
├── hooks/
│   └── usePersistentNarrativeState.ts  # localStorage persistence
└── components/
    ├── NarrativeEngine.tsx       # Main narrative UI
    ├── AccomplishmentsDisplay.tsx # Career milestones
    ├── TechBadgesDisplay.tsx      # Tech stack badges
    └── ProjectHighlights.tsx      # Portfolio projects
```

## 🎮 Core Features

### 1. Branching Narrative
- 20+ story nodes creating multiple career paths
- Each choice leads to a new story segment
- Multiple ending scenarios (success, pivot, specialization)

### 2. Career Paths
- **Frontend Developer**: React, animations, state management
- **Backend Developer**: Node.js, Python, databases
- **Full Stack Developer**: Next.js, microservices, architecture
- **Specialist Paths**: DevOps, Data Engineering, Design Systems

### 3. Unlockables System

#### Career Accomplishments (24 total)
- First Line of Code
- Framework Master
- Design Specialist
- State Management Expert
- Full Stack Master
- Mentor & Thought Leader
- Founder & Entrepreneur
- Enterprise Architect
- And more...

#### Tech Stack Badges (21 total)
Organized by category:
- **Frontend**: React, Vue, JavaScript, TypeScript, Tailwind, Framer Motion
- **Backend**: Node.js, Python, Django, Databases
- **DevOps**: Docker, Kubernetes, AWS, Microservices
- **Tools**: TypeScript, State Management, Full Stack

#### Portfolio Projects (6 total)
- Design System Component Library
- Complex State Management App
- Interactive Motion Experience
- Full-Stack SaaS Platform
- Award-Winning Digital Experience
- Educational Learning Platform

Each project includes:
- Description
- Technologies used
- Real-world impact metrics

## 🎯 Data Types

### NarrativeNode
Represents a point in the story:
```typescript
interface NarrativeNode {
  id: string;
  title: string;
  text: string;
  choices: NarrativeChoice[];
  isEnding?: boolean;
  endingType?: 'success' | 'pivot' | 'specialization';
}
```

### NarrativeChoice
A decision the player can make:
```typescript
interface NarrativeChoice {
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
```

### Unlockables
```typescript
interface CareerAccomplishment {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: Date;
}

interface TechBadge {
  id: string;
  name: string;
  description: string;
  category: 'frontend' | 'backend' | 'devops' | 'database' | 'tools' | 'methodology';
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: Date;
}

interface ProjectHighlight {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  icon: string;
  impact?: string;
  isUnlocked: boolean;
  unlockedAt?: Date;
}
```

## 📚 Using the Narrative Engine

### In Components
```typescript
'use client';
import { useNarrativeStore } from '@/store/narrativeStore';

export function MyComponent() {
  const {
    currentNodeId,
    narrativeStarted,
    narrativeEnded,
    getCurrentNode,
    makeChoice,
    getUnlockedAccomplishments,
    getUnlockedBadges,
    getUnlockedProjects,
  } = useNarrativeStore();

  // Get current story segment
  const currentNode = getCurrentNode();

  // Make a choice
  const handleChoice = (choiceId: string) => {
    makeChoice(choiceId); // Unlocks outcomes automatically
  };

  // Get user's progress
  const accomplishments = getUnlockedAccomplishments();
  const badges = getUnlockedBadges();
  const projects = getUnlockedProjects();
}
```

### Starting the Narrative
```typescript
const { startNarrative } = useNarrativeStore();
startNarrative(); // Begins the story
```

### Making Choices
```typescript
const { makeChoice, getCurrentNode } = useNarrativeStore();

const currentNode = getCurrentNode();
// User clicks a choice button
makeChoice(currentNode.choices[0].id);
// This automatically:
// 1. Moves to the next node
// 2. Unlocks accomplishments
// 3. Unlocks tech badges
// 4. Unlocks projects
```

### Checking Completion
```typescript
const { narrativeEnded, endingType } = useNarrativeStore();

if (narrativeEnded) {
  console.log(`Journey complete! Ending: ${endingType}`);
  // Show completion stats
}
```

## 🔄 Persistence

The narrative state is automatically saved to localStorage via the `usePersistentNarrativeState` hook:

```typescript
'use client';
import { usePersistentNarrativeState } from '@/hooks/usePersistentNarrativeState';

export function MyPage() {
  const { isLoaded } = usePersistentNarrativeState();
  
  // State is automatically saved/loaded
}
```

Saved data includes:
- Current node position
- Visited nodes history
- All unlocked accomplishments
- All unlocked badges
- All unlocked projects
- Narrative completion status

## 🎨 UI Components

### NarrativeEngine
Main component displaying the story:
- Story title and text
- Interactive choice buttons
- Progress indicator
- Completion state

```typescript
import { NarrativeEngine } from '@/components/NarrativeEngine';

<NarrativeEngine />
```

### AccomplishmentsDisplay
Shows career milestones:
- Grid layout of accomplishment cards
- Icon and description
- Unlock timestamp
- Animated reveal

```typescript
import { AccomplishmentsDisplay } from '@/components/AccomplishmentsDisplay';

<AccomplishmentsDisplay />
```

### TechBadgesDisplay
Displays tech stack badges:
- Organized by category (frontend, backend, devops, etc.)
- Icon-based badge design
- Hover tooltips with descriptions
- Completion counter

```typescript
import { TechBadgesDisplay } from '@/components/TechBadgesDisplay';

<TechBadgesDisplay />
```

### ProjectHighlights
Shows portfolio projects:
- Rich project cards
- Technology tags
- Impact metrics
- Organized layout

```typescript
import { ProjectHighlights } from '@/components/ProjectHighlights';

<ProjectHighlights />
```

## 📊 Story Content

### Total Story Elements
- **20 Story Nodes**: From start to various endings
- **Multiple Paths**: Frontend, Backend, Full Stack, Specialist routes
- **30+ Choices**: Different decision points
- **24 Accomplishments**: Career milestones to unlock
- **21 Tech Badges**: Technologies to master
- **6 Projects**: Portfolio items to showcase

### Story Highlights
1. **The Beginning** - Choose your initial path
2. **Skill-Specific Paths** - Deep dive into chosen specialty
3. **Advanced Topics** - Learn frameworks, patterns, and architectures
4. **Career Milestones** - Achievements like "Open Source Contributor", "Founder", "Enterprise Architect"
5. **Multiple Endings** - Different career outcomes based on choices

## 🚀 Customization

### Adding a New Story Node
```typescript
// In narrativeStore.ts, add to narrativeNodes array:
{
  id: 'my-new-node',
  title: 'Node Title',
  text: 'Story text describing this point in the journey...',
  choices: [
    {
      id: 'choice-1',
      text: 'First choice option',
      nextNodeId: 'next-node-id',
      outcomes: {
        accomplishments: ['accomplishment-id'],
        techBadges: ['badge-id'],
        xpReward: 100,
      },
    },
  ],
}
```

### Adding a New Accomplishment
```typescript
// In narrativeStore.ts, add to allAccomplishments array:
{
  id: 'my-accomplishment',
  title: 'Accomplishment Title',
  description: 'What this represents',
  icon: '🎯',
  isUnlocked: false,
}
```

### Adding a New Tech Badge
```typescript
{
  id: 'my-badge',
  name: 'Technology Name',
  description: 'Expert description',
  category: 'frontend', // or backend, devops, etc.
  icon: '⚛️',
  isUnlocked: false,
}
```

### Adding a New Project
```typescript
{
  id: 'my-project',
  title: 'Project Title',
  description: 'What you built',
  technologies: ['Tech1', 'Tech2'],
  icon: '🚀',
  impact: 'How it impacted users/business',
  isUnlocked: false,
}
```

## 💾 Advanced Usage

### Subscribing to Narrative Changes
```typescript
import { useNarrativeStore } from '@/store/narrativeStore';
import { useEffect } from 'react';

export function MyComponent() {
  useEffect(() => {
    // Subscribe to narrative end
    const unsubscribe = useNarrativeStore.subscribe(
      (state) => state.narrativeEnded,
      (isEnded) => {
        if (isEnded) {
          console.log('Journey complete!');
          // Trigger celebration, send analytics, etc.
        }
      }
    );

    return unsubscribe;
  }, []);
}
```

### Getting Journey Statistics
```typescript
const store = useNarrativeStore.getState();

const stats = {
  totalNodesVisited: store.visitedNodes.length,
  accomplishmentsUnlocked: store.unlockedAccomplishments.length,
  badgesEarned: store.unlockedBadges.length,
  projectsCreated: store.unlockedProjects.length,
  careerPath: store.currentNodeId,
  isComplete: store.narrativeEnded,
  endingType: store.endingType,
};
```

### Reset Journey
```typescript
const { resetNarrative } = useNarrativeStore();
resetNarrative(); // Back to start
```

## 🎬 Animation Features

All components use Framer Motion for smooth animations:
- **Page transitions**: Fade and slide animations between story segments
- **Card reveals**: Staggered animations for accomplishments and badges
- **Hover effects**: Interactive feedback on clickable elements
- **Progress bars**: Smooth animated progress indicators
- **Icon animations**: Scale and rotate transforms on appearance

## 📱 Responsive Design

- **Mobile**: Full width, single column layout
- **Tablet**: 2-column grid for badges and accomplishments
- **Desktop**: 3-column grid with enhanced spacing
- **Dark mode**: Full dark mode support with Tailwind

## 🔍 Debugging

To see narrative state in browser console:
```javascript
// In browser DevTools console:
localStorage.getItem('narrative_state')
// Shows all narrative progress as JSON
```

To reset narrative state:
```javascript
localStorage.removeItem('narrative_state')
location.reload()
```

## 📈 Best Practices

1. **Meaningful Choices**: Each choice should lead to distinct outcomes
2. **Progressive Revelation**: Unlock content as players advance
3. **Multiple Paths**: Provide 2-3 options at each decision point
4. **Clear Consequences**: Make it obvious what each choice unlocks
5. **Story Coherence**: Ensure narrative flows naturally between nodes
6. **Celebrate Achievements**: Show accomplishments prominently upon unlock

## 🎓 Learning Outcomes

Users who complete the narrative experience:
- Understand different career paths in tech
- Learn about various technologies and specializations
- See career progression and growth opportunities
- Build portfolio awareness
- Discover multiple successful career trajectories

---

**The Narrative Engine transforms career exploration into an engaging, interactive adventure!** 🚀✨
