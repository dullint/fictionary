import { DictionaryLanguage, DictionnaryEntry } from '../dictionary/types';
import { UserId } from '../socket/types';

export type RoomId = string;
export type Username = string;
export type Color = string;

export interface GameSettings {
  maxPromptTime: number;
  roundNumber: number;
  useExample: boolean;
  showGuessVote: boolean;
  language: DictionaryLanguage;
}

export interface Player {
  username?: Username;
  color: Color;
  userId: UserId;
  isConnected: boolean;
  isInGame: boolean;
  isAdmin: boolean;
}

export interface GameState {
  round: number;
  entry: DictionnaryEntry | null;
  inputEntries: InputDictionaryEntries;
  selections: SelectedDefinitions;
  gameStep: GameStep;
  scores: Scores;
  timer: number | null;
}

export interface ClientRoom {
  gameState: GameState;
  players: Player[];
  gameSettings: GameSettings;
}

export enum GameStep {
  WAIT,
  PROMPT,
  GUESS,
  REVEAL,
  RESULTS,
  FINISHED,
}

export interface SelectedDefinitions {
  [userId: string]: string;
}

export interface Scores {
  [userId: string]: number;
}

export interface InputDictionaryEntry {
  definition: string;
  example: string;
  autosave: boolean;
}
export interface InputDictionaryEntries {
  [userId: string]: InputDictionaryEntry;
}

export interface GameState {
  round: number;
  entry: DictionnaryEntry | null;
  inputEntries: InputDictionaryEntries;
  selections: SelectedDefinitions;
  gameStep: GameStep;
  scores: Scores;
}
