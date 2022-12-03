import { GameSettings } from '../../../../server/src/game/types';

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  maxPromptTime: 4,
  roundNumber: 3,
  useExample: true,
  showGuessVote: false,
};

export const promptTimeOptions = [2, 3, 4, 5, 60];
export const roundNumberOptions = [2, 3, 4, 5, 6];
export const useExampleOptions = [true, false];
export const showGuessVoteOptions = [true, false];
