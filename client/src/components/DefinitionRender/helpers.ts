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
    case 'adjective':
      return 'adj.';
    case 'verb':
      return language === DictionaryLanguage.French ? 'verbe' : 'verb';
    case 'noun': {
      if (language === DictionaryLanguage.English) return 'noun';
      switch (genre) {
        case 'masculin':
          return 'n.m.';
        case 'feminin':
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
