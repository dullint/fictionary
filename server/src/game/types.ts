import { DictionnaryEntry } from '../dictionary/types';

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
  wordSeen: string[];
}
