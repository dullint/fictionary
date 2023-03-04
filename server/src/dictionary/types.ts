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
export interface DictionnaryEntry {
  word: string;
  definition: string;
  example: string;
  nature: WordNature;
  genre?: WordGenre;
}
