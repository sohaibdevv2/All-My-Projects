'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { loadGameStateFromStorage, saveGameStateToStorage } from '@/lib/storage';

/**
 * Hook to synchronize game state with localStorage
 * Loads saved state on mount and saves on every state change
 */
export function usePersistentGameState() {
  const saveGameState = useGameStore((state) => state.saveGameState);
  const loadGameState = useGameStore((state) => state.loadGameState);
  const hasLoadedRef = useRef(false);

  // Load state from storage on mount
  useEffect(() => {
    if (!hasLoadedRef.current) {
      const savedState = loadGameStateFromStorage();
      if (savedState) {
        loadGameState(savedState);
      }
      hasLoadedRef.current = true;
    }
  }, [loadGameState]);

  // Save state to storage whenever it changes
  useEffect(() => {
    if (hasLoadedRef.current) {
      const currentState = saveGameState();
      saveGameStateToStorage(currentState);
    }
  }, [saveGameState]);

  return { isLoaded: hasLoadedRef.current };
}
