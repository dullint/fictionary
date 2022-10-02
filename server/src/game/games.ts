import {
  Definitions,
  DictionnaryEntry,
  GameSettings,
  GameStep,
  Scores,
} from './types';

const GAMES = new Map<string, Game>();

export class Game {
  round: number;
  entry: DictionnaryEntry | null;
  definitions: Definitions;
  gameSettings: GameSettings;
  gameStep: GameStep;
  scores: Scores;

  constructor(gameSettings: GameSettings) {
    this.round = 1;
    this.entry = null;
    this.definitions = {};
    this.gameSettings = gameSettings;
    this.gameStep = GameStep.WAIT;
    this.scores = {};
  }

  addDefinition(socketId: string, definition: string) {
    this.definitions = { ...this.definitions, [socketId]: definition };
  }

  updateEntry(entry: DictionnaryEntry) {
    this.entry = entry;
  }

  removeDefinition(socketId: string) {
    delete this.definitions?.[socketId];
  }

  setGameSettings(gameSettings: GameSettings) {
    this.gameSettings = gameSettings;
  }

  goToNextStep() {
    if (this.gameStep == GameStep.WAIT) {
      this.gameStep = GameStep.PROMPT;
    } else if (this.gameStep == GameStep.PROMPT) {
      this.gameStep = GameStep.GUESS;
    } else if (this.gameStep == GameStep.GUESS) {
      this.gameStep = GameStep.RESULTS;
    } else if (this.gameStep == GameStep.RESULTS) {
      if (this.round == this.gameSettings.roundNumber) {
        this.gameStep = GameStep.FINISHED;
      } else {
        this.gameStep = GameStep.PROMPT;
        this.round++;
      }
    }
    return this.round;
  }

  reset() {
    this.round = 1;
    this.definitions = {};
    this.gameStep = GameStep.WAIT;
    this.scores = {};
    this.entry = null;
  }
}

export default GAMES;
