import { GameSettings } from './types';

export const GAME_DELETE_DELAY = 60 * 1000;

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  maxPromptTime: 4,
  roundNumber: 3,
  useExample: true,
  showGuessVote: false,
};
