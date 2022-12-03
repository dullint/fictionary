import { DEFINITION_SEQUENCES, SEQUENCE_WAIT } from './constants';

export const getTypingSequence = () => {
  return DEFINITION_SEQUENCES.sort((a, b) => 0.5 - Math.random()).reduce(
    (acc, message) => {
      return [...acc, message, SEQUENCE_WAIT];
    },
    []
  );
};
