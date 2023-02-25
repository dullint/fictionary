export enum WordNature {
  VERB = 'verb',
  NOUN = 'noun',
  ADJ = 'adj',
}

export enum WordGenre {
  MAS = 'masculin',
  FEM = 'feminin',
  PROPRE = 'propre',
}

export const getNatureGenre = (nature: WordNature, genre: WordGenre) => {
  switch (nature) {
    case 'adjective':
      return 'adj.';
    case 'verb':
      return 'verbe';
    case 'noun': {
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
