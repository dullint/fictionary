export const getDefinitionDisplayDelay = (entry: {
  definition: string;
  example: string;
}) => {
  const readingLength = entry.definition.length + entry.example.length;
  if (readingLength < 50) {
    return 4000;
  } else if (readingLength < 70) {
    return 5000;
  } else if (readingLength < 100) {
    return 6500;
  } else if (readingLength < 130) {
    return 8000;
  } else if (readingLength < 160) {
    return 10000;
  } else if (readingLength < 200) {
    return 13000;
  } else if (readingLength < 250) {
    return 15000;
  } else return 17000;
};
