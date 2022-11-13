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

export class Game {
  io: Server;
  roomId: string;
  round: number;
  entry: DictionnaryEntry | null;
  definitions: Definitions;
  selections: SelectedDefinitions;
  gameSettings: GameSettings;
  gameStep: GameStep;
  scores: Scores;
  timer: NodeJS.Timer | null;

  constructor(io: Server, roomId: string, gameSettings: GameSettings) {
    this.io = io;
    this.roomId = roomId;
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

  newWord() {
    if (this.timer) clearInterval(this.timer);
    this.definitions = {};
    const entry = get_random_entry();
    this.entry = entry;
    this.runTimer(this.gameSettings.maxPromptTime);
  }

  newRound() {
    this.round++;
    this.gameStep = GameStep.PROMPT;
    this.selections = {};
    this.definitions = {};
    this.newWord();
  }

  reset() {
    this.round = 0;
    this.gameStep = GameStep.WAIT;
    this.definitions = {};
    this.selections = {};
    this.scores = {};
  }

  runTimer(time: number) {
    var counter = time * 60;
    this.timer = setInterval(() => {
      this.io.to(this.roomId).emit('timer', counter);
      if (counter === 0 && this.timer) {
        clearInterval(this.timer);
        this.goToNextStep();
        this.io.to(this.roomId).emit('game', this.info());
      }
      counter--;
    }, 1000);
  }

  info() {
    return {
      round: this.round,
      entry: this.entry,
      definitions: this.definitions,
      selections: this.selections,
      gameSettings: this.gameSettings,
      gameStep: this.gameStep,
      scores: this.scores,
    };
  }
}

export default new Map<string, Game>();