import { GameSettings } from '../../../../server/game/types';

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  maxPromptTime: 3,
  roundNumber: 3,
  useExample: false,
};

export const promptTimeOptions = [1, 2, 3, 4, 60];
export const roundNumberOptions = [2, 3, 4, 5, 6];
export const useExampleOptions = [true, false];
