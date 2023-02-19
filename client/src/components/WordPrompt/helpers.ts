import {
  InputDictionaryEntries,
  Player,
} from '../../../../server/src/room/types';

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

export const numberOfMissingDefinitions = (
  inputEntries: InputDictionaryEntries,
  inGamePlayers: Player[]
) => {
  const usersWhoSubmittedDefinition = Object.entries(inputEntries).reduce(
    (acc, [userId, entry]) => {
      if (!entry?.autosave) acc.push(userId);
      return acc;
    },
    [] as string[]
  );
  const missingInGamePlayersDefinitions = inGamePlayers.filter(
    (player) => !usersWhoSubmittedDefinition.includes(player.userId)
  );
  return missingInGamePlayersDefinitions.length;
};
