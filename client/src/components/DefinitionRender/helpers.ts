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

export const getNatureGenre = (
  nature: WordNature,
  genre: WordGenre,
  language: DictionaryLanguage
) => {
  switch (nature) {
    case 'adj':
      return 'adj.';
    case 'verb':
      return language === DictionaryLanguage.French ? 'verbe' : 'verb';
    case 'noun': {
      if (language === DictionaryLanguage.English) return 'noun';
      switch (genre) {
        case 'mas':
          return 'n.m.';
        case 'fem':
          return 'n.f.';
        case 'propre':
          return 'n.propre';
        default:
          return 'n.';
      }
    }
    default:
      return '';
  }
};
