export enum WordNature {
  VERB = 'verb',
  NOUN = 'noun',
  ADJ = 'adj',
}

export enum WordGenre {
  MAS = 'mas',
  FEM = 'fem',
  PROPRE = 'propre',
}

export enum DictionaryLanguage {
  French = 'french',
  English = 'english',
}

export type Word = string;

export interface DictionnaryEntry {
  word: Word;
  definition: string;
  example: string;
  nature: WordNature;
  genre?: WordGenre;
}
