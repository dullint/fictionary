export function* getPlayerIndexGenerator(n: number) {
  for (let i = 0; i < n; i++) {
    yield i;
  }
}
