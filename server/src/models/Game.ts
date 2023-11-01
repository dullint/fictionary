import dictionary from '../dictionary';
import {
  DictionaryLanguage,
  DictionnaryEntry,
  Word,
} from '../dictionary/types';
import logger from '../logging';
import { Definition } from './GameDefinition';
import { RoomId } from './room';

export interface Game {
  roomId: RoomId;
  settings: GameSettings;
  rounds: Round[];
  wordSeen: string[];
}


export interface GameSettings {
  maxPromptTime: number;
  roundNumber: number;
  useExample: boolean;
  showGuessVote: boolean;
  language: DictionaryLanguage;
}

export class GameModel implements Game {
  roomId: RoomId;
  settings: GameSettings;
  rounds: Round[];
  wordSeen: Word[];

  constructor(gameSettings: GameSettings, roomId: RoomId) {
    this.roomId = roomId;
    this.settings = gameSettings;
    this.rounds = [];
    this.wordSeen = [];
  }

  getUnseenDictionaryEntry = (): DictionnaryEntry => {
    const language = this.settings.language;
    var dictEntry = dictionary.getRandomWordEntry(language);
    while (this.wordSeen.includes(dictEntry.word)) {
      dictEntry = dictionary.getRandomWordEntry(language);
    }
    return dictEntry;
  };

  startNewRound = () => {
    const dictEntry = this.getUnseenDictionaryEntry();
    this.wordSeen.push(dictEntry.word);
    const round: Round = {
      definitions: [],
      dictionaryEntry: dictEntry,
      step: GameStep.WRITE,
      timer:
    };
    this.rounds.push(round);
  };


  startGame() {}

  endGame() {}
}
