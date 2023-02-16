import { GameSettings } from './types';

export const MAX_PLAYER_IN_ROOM = 10;
export const ROOM_DELETE_DELAY = 60 * 1000; // 1 minute

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  maxPromptTime: 4,
  roundNumber: 3,
  useExample: true,
  showGuessVote: false,
};
