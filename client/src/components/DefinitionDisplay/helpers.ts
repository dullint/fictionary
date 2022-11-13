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

export const getNatureGenre = (nature: WordNature, genre: WordGenre) => {
  switch (nature) {
    case 'adj':
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
