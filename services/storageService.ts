import { GameState } from '../types';

const SAVE_KEY = 'arth_mitra_save_v1';

export const saveGame = (state: GameState) => {
  try {
    // Only save if the game is in progress
    if (state.gameStatus === 'PLAYING' || state.gameStatus === 'FEEDBACK') {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        ...state,
        savedAt: Date.now() // Optional metadata
      }));
    }
  } catch (e) {
    console.error('Failed to save game:', e);
  }
};

export const loadGame = (): GameState | null => {
  try {
    const data = localStorage.getItem(SAVE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to load game:', e);
    return null;
  }
};

export const hasSavedGame = (): boolean => {
  return !!localStorage.getItem(SAVE_KEY);
};

export const clearSave = () => {
  localStorage.removeItem(SAVE_KEY);
};

export const getSavedGameMeta = () => {
  const state = loadGame();
  if (!state || !state.profile) return null;
  return {
    name: state.profile.name,
    occupation: state.profile.occupation,
    turn: state.turn,
    savings: state.savings
  };
};
