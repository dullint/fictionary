export const getGuessingTime = (numberOfDefinitions: number) => {
  if (numberOfDefinitions < 5) return 30;
  if (numberOfDefinitions < 10) return 60;
  return 90;
};
