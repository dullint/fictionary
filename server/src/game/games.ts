import { get_random_entry, runTimer } from './helpers';
import {
  Definitions,
  DictionnaryEntry,
  GameSettings,
  GameStep,
  Scores,
  SelectedDefinitions,
} from './types';

const GAMES = new Map<string, Game>();

export class Game {
  round: number;
  entry: DictionnaryEntry | null;
  definitions: Definitions;
  selections: SelectedDefinitions;
  gameSettings: GameSettings;
  gameStep: GameStep;
  scores: Scores;

  constructor(gameSettings: GameSettings) {
    this.round = 0;
    this.entry = null;
    this.definitions = {};
    this.selections = {};
    this.gameSettings = gameSettings;
    this.gameStep = GameStep.WAIT;
    this.scores = {};
  }

  removeDefinition(socketId: string) {
    delete this.definitions?.[socketId];
  }

  selectDefinition(choosingSocketId: string, definitionSocketId: string) {
    this.selections = {
      ...this.selections,
      [choosingSocketId]: definitionSocketId,
    };
  }

  goToNextStep() {
    if (this.gameStep == GameStep.PROMPT) {
      this.gameStep = GameStep.GUESS;
    } else if (this.gameStep == GameStep.GUESS) {
      this.gameStep = GameStep.RESULTS;
    }
  }

  newRound() {
    this.round++;
    this.gameStep = GameStep.PROMPT;
    this.definitions = {};
    this.selections = {};
    const entry = get_random_entry();
    this.entry = entry;
  }

  reset() {
    this.round = 0;
    this.gameStep = GameStep.WAIT;
    this.definitions = {};
    this.selections = {};
    this.scores = {};
  }
}

export default GAMES;
