export interface DictionnaryEntry {
  word: string;
  definition: string;
}

export enum GameStep {
  WAIT,
  PROMPT,
  GUESS,
  RESULTS,
  FINISHED,
}

export interface GameSettings {
  maxPromptTime: number;
  roundNumber: number;
}

export interface SelectedDefinitions {
  [socketId: string]: string;
}

export interface Scores {
  [socketId: string]: number;
}

export interface Definitions {
  [socketId: string]: string;
}
