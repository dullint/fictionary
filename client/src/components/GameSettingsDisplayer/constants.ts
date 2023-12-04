export enum DictionaryLanguage {
  French = "french",
  English = "english",
}

export enum LanguageFlag {
  french = "🇫🇷",
  english = "🇬🇧",
}

export const promptTimeOptions = [1, 1.5, 2, 3, 4];
export const languageOptions = [
  DictionaryLanguage.French,
  DictionaryLanguage.English,
];
export const roundNumberOptions = [3, 4, 5, 7, 10];
export const useExampleOptions = [true, false];
export const showGuessVoteOptions = [true, false];
