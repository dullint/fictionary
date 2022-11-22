export const cleanSentence = (sentence: string) => {
  const trimedSentence = sentence.trim();
  const loweredSentence =
    trimedSentence.charAt(0).toLowerCase() + trimedSentence.slice(1);
  const removedDot =
    loweredSentence.charAt(loweredSentence.length - 1) === '.'
      ? loweredSentence.slice(0, loweredSentence.length - 1)
      : loweredSentence;
  return removedDot;
};
