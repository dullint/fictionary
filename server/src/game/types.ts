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
  showGuessVote: boolean;
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
