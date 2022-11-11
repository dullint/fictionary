import dictionary from '../dictionary';

export const get_random_entry = () =>
  dictionary.entries[Math.floor(Math.random() * dictionary.entries.length)];
