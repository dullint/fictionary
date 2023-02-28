export enum WordNature {
  Verb = 'verb',
  Noun = 'noun',
  Adjective = 'adjective',
}

export enum WordGenre {
  Masculin = 'masculin',
  Feminin = 'feminin',
  Propre = 'propre',
}
export interface DictionnaryEntry {
  word: string;
  definition: string;
  example: string;
  nature: WordNature;
  genre?: WordGenre;
}

export enum DictionaryLanguage {
  French = 'french',
  English = 'english',
}
