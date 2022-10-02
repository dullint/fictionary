import { dictionnary } from './dictionnary';

export const get_random_word = () =>
  dictionnary[Math.floor(Math.random() * dictionnary.length)];
