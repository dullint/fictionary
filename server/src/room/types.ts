import { GameState } from '../game/types';
import { Player } from '../player';

export type RoomId = string;

export interface GameSettings {
  maxPromptTime: number;
  roundNumber: number;
  useExample: boolean;
  showGuessVote: boolean;
}

export interface ClientRoom {
  gameState: GameState;
  players: Player[];
  gameSettings: GameSettings;
}
