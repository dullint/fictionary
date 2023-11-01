import { socketManager } from '..';
import { DictionnaryEntry } from '../dictionary/types';
import logger from '../logging';
import { UserId } from '../socket/types';
import { GameDefinition } from './GameDefinition';
import { RoomId } from './room';

export interface Round {
  roomId: RoomId;
  roundNumber: number;
  definitions: GameDefinition[];
  dictionaryEntry: DictionnaryEntry;
  step: GameStep;
  timer: NodeJS.Timer | null;
}

export enum GameStep {
  WRITE = 'write',
  DISPLAY = 'display',
  GUESS = 'guess',
  REVEAL = 'reveal',
  SCORE = 'score',
}

export class RoundModel implements Round {
  roomId: RoomId;
  roundNumber: number;
  definitions: GameDefinition[];
  dictionaryEntry: DictionnaryEntry;
  step: GameStep;
  timer: NodeJS.Timer | null;

  constructor(
    roomId: RoomId,
    roundNumber: number,
    dictEntry: DictionnaryEntry
  ) {
    this.roomId = roomId;
    this.roundNumber = roundNumber;
    this.definitions = [];
    this.dictionaryEntry = dictEntry;
    this.step = GameStep.WRITE;
    this.timer = null;
  }

  updateRoundWord = (dictEntry: DictionnaryEntry) => {
    this.stopTimer();
    this.definitions = [];
    updateWordSeen();
    this.dictionaryEntry = dictEntry;
    logger.info(
      `[GAME ${this.roomId}][ROUND ${this.roundNumber}] New word: ${dictEntry.word}`
    );
  };

  writingOnCounterEnd = () => {
    goToDisplayStep();
    logger.info(
      `[GAME ${this.roomId}] Timer ran out of time, moving forward to the SHOW step`
    );
  };

  addDefinition(
    authorId: UserId,
    definition: string,
    example: string,
    isAutosave: boolean
  ) {
    this.definitions.push({
      authorId,
      text: definition,
      example,
      isAutosave,
      votersId: [],
    });
    if (haveAllPlayerPromptDefinition(room)) {
      if (room.timer) clearInterval(room.timer);
      game.gameStep = GameStep.SHOW;
      runCarouselInterval(io, room, GameStep.SHOW);
    }
  }

  startTimer(duration: number, onCounterEnd: () => void) {
    this.timer = setInterval(() => {
      var counter = duration * 60;
      socketManager.sendMessageToRoom(this.roomId, 'timer', counter);
      if (counter === 0) {
        this.stopTimer();
        onCounterEnd();
      }
      counter--;
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
