export enum WordNature {
  VERB = 'verbe',
  NOUN = 'nom',
  ADJ = 'adj',
}

export enum WordGenre {
  MASCULIN = 'mas',
  FEMININ = 'fem',
  PROPE = 'propre',
}
export interface DictionnaryEntry {
  word: string;
  definition: string;
  example: string;
  nature: WordNature;
  genre: WordGenre;
}
