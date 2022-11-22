export const cleanSentence = (sentence: string) => {
  const loweredSentence = sentence.charAt(0).toLowerCase() + sentence.slice(1);
  const removedDot =
    loweredSentence.charAt(loweredSentence.length - 1) === '.'
      ? loweredSentence.slice(0, loweredSentence.length - 1)
      : loweredSentence;
  return removedDot;
};
