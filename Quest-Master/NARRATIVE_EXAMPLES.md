# Narrative Engine Examples

Quick examples showing how to use the narrative engine in your application.

## Example 1: Display Narrative Progress

```typescript
'use client';

import { motion } from 'framer-motion';
import { useNarrativeStore } from '@/store/narrativeStore';

export function NarrativeProgress() {
  const { 
    narrativeStarted, 
    narrativeEnded,
    getUnlockedAccomplishments,
    getUnlockedBadges,
    getUnlockedProjects,
  } = useNarrativeStore();

  const accomplishments = getUnlockedAccomplishments();
  const badges = getUnlockedBadges();
  const projects = getUnlockedProjects();

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Career Progress</h2>
      
      {!narrativeStarted ? (
        <p>Haven't started your journey yet!</p>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="font-semibold">🏆 Accomplishments: {accomplishments.length}</p>
            <ul className="text-sm text-gray-600">
              {accomplishments.map(a => (
                <li key={a.id}>✓ {a.title}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <p className="font-semibold">⭐ Tech Badges: {badges.length}</p>
            <p className="text-sm text-gray-600">{badges.map(b => b.name).join(', ')}</p>
          </div>
          
          <div>
            <p className="font-semibold">🚀 Projects: {projects.length}</p>
            <p className="text-sm text-gray-600">{projects.map(p => p.title).join(', ')}</p>
          </div>

          {narrativeEnded && (
            <motion.div 
              initial={{ scale: 0.8 }} 
              animate={{ scale: 1 }}
              className="bg-green-100 border border-green-400 rounded p-4"
            >
              <p className="font-bold text-green-900">🎉 Journey Complete!</p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
```

## Example 2: Create a Journey Summary Card

```typescript
'use client';

import { useNarrativeStore } from '@/store/narrativeStore';

export function JourneySummary() {
  const store = useNarrativeStore();
  
  const totalUnlocked = 
    store.unlockedAccomplishments.length + 
    store.unlockedBadges.length + 
    store.unlockedProjects.length;

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">🚀 Career Journey Summary</h3>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/20 rounded p-3 text-center">
          <div className="text-3xl font-bold">{store.visitedNodes.length}</div>
          <div className="text-sm">Story Nodes</div>
        </div>
        
        <div className="bg-white/20 rounded p-3 text-center">
          <div className="text-3xl font-bold">{totalUnlocked}</div>
          <div className="text-sm">Unlocked Items</div>
        </div>
        
        <div className="bg-white/20 rounded p-3 text-center">
          <div className="text-3xl font-bold">{store.narrativeEnded ? '✓' : '→'}</div>
          <div className="text-sm">{store.narrativeEnded ? 'Complete' : 'In Progress'}</div>
        </div>
      </div>

      {store.endingType && (
        <p className="text-sm mt-4">
          Final Path: <span className="font-bold capitalize">{store.endingType}</span>
        </p>
      )}
    </div>
  );
}
```

## Example 3: Display Latest Unlocks

```typescript
'use client';

import { useNarrativeStore } from '@/store/narrativeStore';

export function LatestUnlocks() {
  const { 
    unlockedAccomplishments,
    unlockedBadges,
    unlockedProjects,
  } = useNarrativeStore();

  // Get most recent unlocks (sorted by unlock time)
  const recentAccomplishment = unlockedAccomplishments[unlockedAccomplishments.length - 1];
  const recentBadge = unlockedBadges[unlockedBadges.length - 1];
  const recentProject = unlockedProjects[unlockedProjects.length - 1];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Recent Unlocks</h3>
      
      {recentAccomplishment && (
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-600">Latest Accomplishment</p>
          <p className="font-bold text-lg">{recentAccomplishment.icon} {recentAccomplishment.title}</p>
          <p className="text-sm text-gray-600">{recentAccomplishment.description}</p>
        </div>
      )}

      {recentBadge && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600">Latest Tech Badge</p>
          <p className="font-bold text-lg">{recentBadge.icon} {recentBadge.name}</p>
          <p className="text-sm text-gray-600">{recentBadge.description}</p>
        </div>
      )}

      {recentProject && (
        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <p className="text-sm text-emerald-600">Latest Project</p>
          <p className="font-bold text-lg">{recentProject.icon} {recentProject.title}</p>
          <p className="text-sm text-gray-600">{recentProject.description}</p>
        </div>
      )}
    </div>
  );
}
```

## Example 4: Track Narrative Milestones

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useNarrativeStore } from '@/store/narrativeStore';

export function MilestoneTracker() {
  const store = useNarrativeStore();
  const [milestones, setMilestones] = useState<string[]>([]);

  useEffect(() => {
    // Track major milestones
    const newMilestones: string[] = [];

    if (store.narrativeStarted) {
      newMilestones.push('🚀 Started the journey');
    }

    if (store.unlockedAccomplishments.length >= 3) {
      newMilestones.push('🏆 Unlocked 3 accomplishments');
    }

    if (store.unlockedBadges.length >= 5) {
      newMilestones.push('⭐ Mastered 5 technologies');
    }

    if (store.unlockedProjects.length > 0) {
      newMilestones.push('🚀 Built your first project');
    }

    if (store.narrativeEnded) {
      newMilestones.push(`✅ Journey Complete (${store.endingType})`);
    }

    setMilestones(newMilestones);
  }, [store]);

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-bold">Milestones Reached</h3>
      <div className="space-y-2">
        {milestones.map((milestone, idx) => (
          <div key={idx} className="flex items-center gap-2 p-2 bg-gray-100 rounded">
            <span>{milestone}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Example 5: Filter Badges by Category

```typescript
'use client';

import { useNarrativeStore } from '@/store/narrativeStore';

export function BadgesByCategory() {
  const { getUnlockedBadges } = useNarrativeStore();
  const badges = getUnlockedBadges();

  // Group by category
  const grouped = badges.reduce((acc, badge) => {
    if (!acc[badge.category]) acc[badge.category] = [];
    acc[badge.category].push(badge);
    return acc;
  }, {} as Record<string, typeof badges>);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, categoryBadges]) => (
        <div key={category}>
          <h4 className="font-bold capitalize mb-3">{category}</h4>
          <div className="grid grid-cols-4 gap-3">
            {categoryBadges.map(badge => (
              <div 
                key={badge.id}
                className="text-center p-3 bg-gray-100 rounded-lg"
                title={badge.description}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <div className="text-xs font-semibold">{badge.name}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

## Example 6: Export Journey as JSON

```typescript
'use client';

import { useNarrativeStore } from '@/store/narrativeStore';

export function ExportJourney() {
  const store = useNarrativeStore();

  const handleExport = () => {
    const journeyData = {
      startDate: new Date(),
      duration: store.visitedNodes.length,
      endingType: store.endingType,
      accomplishments: store.unlockedAccomplishments.map(a => a.title),
      badges: store.unlockedBadges.map(b => b.name),
      projects: store.unlockedProjects.map(p => p.title),
    };

    const json = JSON.stringify(journeyData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `career-journey-${Date.now()}.json`;
    a.click();
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      📥 Export Journey
    </button>
  );
}
```

## Example 7: Show Career Path Stats

```typescript
'use client';

import { useNarrativeStore } from '@/store/narrativeStore';

export function CareerPathStats() {
  const store = useNarrativeStore();
  const currentNode = store.getCurrentNode();

  const stats = {
    nodesExplored: store.visitedNodes.length,
    choicesMade: store.visitedNodes.length - 1,
    achievementsEarned: store.unlockedAccomplishments.length,
    technologiesLearned: store.unlockedBadges.length,
    projectsBuilt: store.unlockedProjects.length,
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {Object.entries(stats).map(([key, value]) => (
        <div key={key} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <p className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
          <p className="text-3xl font-bold text-blue-600">{value}</p>
        </div>
      ))}
    </div>
  );
}
```

---

Copy and paste these examples into your project to quickly integrate narrative engine features! 🚀
