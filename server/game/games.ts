import { Server } from 'socket.io';
import { DictionnaryEntry } from '../dictionary/types';
import { get_random_entry } from './helpers';
import {
  Definitions,
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
  timer: NodeJS.Timer | null;

  constructor(gameSettings: GameSettings) {
    this.round = 0;
    this.entry = null;
    this.definitions = {};
    this.selections = {};
    this.gameSettings = gameSettings;
    this.gameStep = GameStep.WAIT;
    this.scores = {};
    this.timer = null;
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
    if (this.timer) clearInterval(this.timer);
    if (this.gameStep == GameStep.PROMPT) {
      this.gameStep = GameStep.GUESS;
      return;
    }
    if (this.gameStep == GameStep.GUESS) {
      this.gameStep = GameStep.REVEAL;
      return;
    }
    if (this.gameStep == GameStep.REVEAL) {
      this.gameStep = GameStep.RESULTS;
      return;
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

  runTimer = (io: Server, roomId: string, time: number) => {
    var counter = time * 60;
    this.timer = setInterval(() => {
      io.emit('timer', counter);
      if (counter === 0 && this.timer) {
        clearInterval(this.timer);
        this.goToNextStep();
        io.to(roomId).emit('game', this);
      }
      counter--;
    }, 1000);
  };
}

export default GAMES;
