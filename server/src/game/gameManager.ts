import { Server, Socket } from 'socket.io';
import { DictionnaryEntry } from '../dictionary/types';
import { getConnectedPlayers } from '../room/helpers';
import { GamePlayer } from '../room/types';
import { UserId } from '../socket/sessionStore';
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
  gamePlayers: GamePlayer[];
  adminUserId: string;

  constructor(
    io: Server,
    roomId: string,
    gameSettings: GameSettings,
    adminUserId: string
  ) {
    this.io = io;
    this.roomId = roomId;
    this.round = 0;
    this.entry = null;
    this.inputEntries = {};
    this.selections = {};
    this.gameSettings = gameSettings;
    this.gameStep = GameStep.WAIT;
    this.scores = {};
    this.timer = null;
    this.wordSeen = [];
    this.gamePlayers = [];
    this.adminUserId = adminUserId;
  }

  removeDefinition(username: string) {
    delete this.inputEntries?.[username];
  }

  selectDefinition(choosingUsername: string, definitionUsername: string) {
    this.selections = {
      ...this.selections,
      [choosingUsername]: definitionUsername,
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

  addPlayers(players: GamePlayer[]) {
    this.gamePlayers.push(...players);
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
      gamePlayers: this.gamePlayers,
      // adminPlayer: this.adminPlayer,
    };
  }
}
