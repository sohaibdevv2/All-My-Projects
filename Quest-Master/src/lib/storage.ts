/**
 * Game State Storage Utilities
 * Handles saving and loading game state from localStorage
 */

const STORAGE_KEY = 'game_state';

export function saveGameStateToStorage(state: string): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, state);
    } catch (error) {
      console.error('Failed to save game state to localStorage:', error);
    }
  }
}

export function loadGameStateFromStorage(): string | null {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to load game state from localStorage:', error);
      return null;
    }
  }
  return null;
}

export function clearGameStateStorage(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear game state:', error);
    }
  }
}
