export const delay = async (milliseconds) => {
  const timeout = new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
  return await timeout;
};
