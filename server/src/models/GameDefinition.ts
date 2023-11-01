import { Word } from '../dictionary/types';
import { UserId } from '../socket/types';

export interface GameDefinition {
  authorId: UserId;
  text: string;
  votersId: UserId[];
  isAutosave: boolean;
  example: string | null;
}

export class GameDefinitionModel implements GameDefinition {
  authorId: UserId;
  word: Word;
  text: string;
  votersId: UserId[];
  isAutosave: boolean;
  example: string | null;

  constructor(
    authorId: UserId,
    word: Word,
    text: string,
    example: string | null,
    isAutosave: boolean
  ) {
    this.authorId = authorId;
    this.text = text;
    this.word = word;
    this.votersId = [];
    this.isAutosave = isAutosave;
    this.example = example;
  }
}
