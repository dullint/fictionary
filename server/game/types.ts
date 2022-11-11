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
}

export interface SelectedDefinitions {
  [username: string]: string;
}

export interface Scores {
  [username: string]: number;
}

export interface Definitions {
  [username: string]: string;
}