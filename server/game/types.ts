export enum GameStep {
  WAIT,
  PROMPT,
  GUESS,
  REVEAL,
  RESULTS,
  FINISHED,
}

export interface GameSettings {
  maxPromptTime: number;
  roundNumber: number;
  useExample: boolean;
}

export interface SelectedDefinitions {
  [username: string]: string;
}

export interface Scores {
  [username: string]: number;
}

export interface InputDictionaryEntry {
  definition: string;
  example: string;
}
export interface InputDictionaryEntries {
  [username: string]: InputDictionaryEntry;
}
