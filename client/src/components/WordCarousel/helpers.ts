export const getDefinitionDisplayDelay = (definition: string) => {
  const defLength = definition.length;
  if (defLength < 50) {
    return 4000;
  } else if (defLength < 70) {
    return 5000;
  } else if (defLength < 100) {
    return 6500;
  } else if (defLength < 130) {
    return 8000;
  } else return 10000;
};
