import { DictionaryLanguage } from '../dictionary/types';
import { GameSettings, GameState, GameStep, Player } from './types';

export const MAX_PLAYER_IN_ROOM = 10;
export const ROOM_DELETE_DELAY = 60 * 1000; // 1 minute
export const DISCONNECT_FROM_GAME_DELAY = 10 * 1000; //10 seconds

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  maxPromptTime: 1.5,
  roundNumber: 3,
  useExample: false,
  showGuessVote: false,
  language: DictionaryLanguage.French,
};

export const DEFAULT_GAME_STATE: GameState = {
  round: 0,
  entry: null,
  inputEntries: {},
  selections: {},
  gameStep: GameStep.WAIT,
  scores: {},
  timer: null,
};

export const SHOW_CAROUSEL_TIME = 7000;
export const REVEAL_CAROUSEL_TIME = 3000;
