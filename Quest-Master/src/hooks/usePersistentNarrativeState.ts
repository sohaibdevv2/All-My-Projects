'use client';

import { useEffect, useRef } from 'react';
import { useNarrativeStore } from '@/store/narrativeStore';

const NARRATIVE_STORAGE_KEY = 'narrative_state';

/**
 * Hook to synchronize narrative state with localStorage
 * Loads saved state on mount and saves on every state change
 */
export function usePersistentNarrativeState() {
  const state = useNarrativeStore();
  const hasLoadedRef = useRef(false);

  // Load state from storage on mount
  useEffect(() => {
    if (!hasLoadedRef.current) {
      const savedState = localStorage.getItem(NARRATIVE_STORAGE_KEY);
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          // Restore the state
          if (parsed.narrativeStarted) {
            useNarrativeStore.setState({
              currentNodeId: parsed.currentNodeId,
              visitedNodes: parsed.visitedNodes,
              narrativeStarted: parsed.narrativeStarted,
              narrativeEnded: parsed.narrativeEnded,
              endingType: parsed.endingType,
              unlockedAccomplishments: parsed.unlockedAccomplishments || [],
              unlockedBadges: parsed.unlockedBadges || [],
              unlockedProjects: parsed.unlockedProjects || [],
            });
          }
        } catch (error) {
          console.error('Failed to load narrative state:', error);
        }
      }
      hasLoadedRef.current = true;
    }
  }, []);

  // Save state to storage whenever it changes
  useEffect(() => {
    if (hasLoadedRef.current) {
      try {
        const stateToSave = {
          currentNodeId: state.currentNodeId,
          visitedNodes: state.visitedNodes,
          narrativeStarted: state.narrativeStarted,
          narrativeEnded: state.narrativeEnded,
          endingType: state.endingType,
          unlockedAccomplishments: state.unlockedAccomplishments,
          unlockedBadges: state.unlockedBadges,
          unlockedProjects: state.unlockedProjects,
        };
        localStorage.setItem(NARRATIVE_STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (error) {
        console.error('Failed to save narrative state:', error);
      }
    }
  }, [state]);

  return { isLoaded: hasLoadedRef.current };
}
