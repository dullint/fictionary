import { Server } from 'socket.io';
import { DictionnaryEntry } from '../dictionary/types';
import { Player } from '../player';
import { UserId } from '../socket/types';
import { DEFAULT_GAME_SETTINGS } from './constant';
import { GamePlayers } from './gamePlayers';
import { get_random_entry } from './helpers';
import {
  GameSettings,
  GameStep,
  InputDictionaryEntries,
  Scores,
  SelectedDefinitions,
} from './types';

export class Game {
  io: Server;
  roomId: string;
  round: number;
  entry: DictionnaryEntry | null;
  inputEntries: InputDictionaryEntries;
  selections: SelectedDefinitions;
  gameSettings: GameSettings;
  gameStep: GameStep;
  scores: Scores;
  wordSeen: string[];
  timer: NodeJS.Timer | null;
  players: GamePlayers;

  constructor(io: Server, roomId: string, creatorUserId: UserId) {
    this.io = io;
    this.roomId = roomId;
    this.round = 0;
    this.entry = null;
    this.inputEntries = {};
    this.selections = {};
    this.gameSettings = DEFAULT_GAME_SETTINGS;
    this.gameStep = GameStep.WAIT;
    this.scores = {};
    this.timer = null;
    this.wordSeen = [];
    this.players = new GamePlayers(creatorUserId);
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
      if (this.round >= this.gameSettings.roundNumber) {
        this.gameStep = GameStep.FINISHED;
        return;
      }
      this.gameStep = GameStep.RESULTS;
      return;
    }
  }

  newWord() {
    if (this.timer) clearInterval(this.timer);
    this.inputEntries = {};
    var entry = get_random_entry();
    while (this.wordSeen.includes(entry.word)) {
      entry = get_random_entry();
    }
    this.entry = entry;
    this.runTimer(this.gameSettings.maxPromptTime);
  }

  newRound() {
    this.round++;
    this.gameStep = GameStep.PROMPT;
    this.selections = {};
    this.inputEntries = {};
    this.newWord();
  }

  reset() {
    this.round = 0;
    this.gameStep = GameStep.WAIT;
    this.inputEntries = {};
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
      inputEntries: this.inputEntries,
      selections: this.selections,
      gameSettings: this.gameSettings,
      gameStep: this.gameStep,
      scores: this.scores,
    };
  }
}
