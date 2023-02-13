import { Server } from 'socket.io';
import { DictionnaryEntry } from '../dictionary/types';
import { GameSettings } from '../room/types';
import { get_random_entry } from './helpers';
import {
  GameState,
  GameStep,
  InputDictionaryEntries,
  Scores,
  SelectedDefinitions,
} from './types';

export class GameManager {
  roomId: string;
  round: number;
  entry: DictionnaryEntry | null;
  inputEntries: InputDictionaryEntries;
  selections: SelectedDefinitions;
  gameStep: GameStep;
  scores: Scores;
  wordSeen: string[];
  timer: NodeJS.Timer | null;

  constructor(roomId: string) {
    this.roomId = roomId;
    this.round = 0;
    this.entry = null;
    this.inputEntries = {};
    this.selections = {};
    this.gameStep = GameStep.WAIT;
    this.scores = {};
    this.timer = null;
    this.wordSeen = [];
  }

  removeDefinition(userId: string) {
    delete this.inputEntries?.[userId];
  }

  selectDefinition(choosingUserId: string, definitionUserId: string) {
    this.selections = {
      ...this.selections,
      [choosingUserId]: definitionUserId,
    };
  }

  goToNextStep(gameSettings: GameSettings) {
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
      if (this.round >= gameSettings.roundNumber) {
        this.gameStep = GameStep.FINISHED;
        return;
      }
      this.gameStep = GameStep.RESULTS;
      return;
    }
  }

  newWord(io: Server, gameSettings: GameSettings) {
    if (this.timer) clearInterval(this.timer);
    this.inputEntries = {};
    var entry = get_random_entry();
    while (this.wordSeen.includes(entry.word)) {
      entry = get_random_entry();
    }
    this.entry = entry;
    this.runTimer(io, gameSettings.maxPromptTime, gameSettings);
  }

  newRound(io: Server, gameSettings: GameSettings) {
    this.round++;
    this.gameStep = GameStep.PROMPT;
    this.selections = {};
    this.inputEntries = {};
    this.newWord(io, gameSettings);
  }

  reset() {
    this.round = 0;
    this.gameStep = GameStep.WAIT;
    this.inputEntries = {};
    this.selections = {};
    this.scores = {};
  }

  runTimer(io: Server, time: number, gameSettings: GameSettings) {
    var counter = time * 60;
    this.timer = setInterval(() => {
      io.to(this.roomId).emit('timer', counter);
      if (counter === 0 && this.timer) {
        clearInterval(this.timer);
        this.goToNextStep(gameSettings);
        this.updateClient(io);
      }
      counter--;
    }, 1000);
  }

  getState(): GameState {
    return {
      round: this.round,
      entry: this.entry,
      inputEntries: this.inputEntries,
      selections: this.selections,
      gameStep: this.gameStep,
      scores: this.scores,
      wordSeen: this.wordSeen,
    };
  }

  updateClient(io: Server) {
    io.to(this.roomId).emit('game_state', this.getState());
  }
}
