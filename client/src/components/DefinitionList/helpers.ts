import {
  GameState,
  InputDictionaryEntries,
  InputDictionaryEntry,
  Player,
  SelectedDefinitions,
} from '../../../../server/src/room/types';
import { shuffle } from 'shuffle-seed';

import { DictionnaryEntry } from '../../../../server/src/dictionary/types';
import { DICTIONARY_PLAYER } from './constants';

export const getVotingPlayersByDefinitions = (
  players: Player[],
  selections: SelectedDefinitions
) => {
  const votingPlayersByDefinitions = players.reduce((acc, { userId }) => {
    acc[userId] = players.filter(
      (player) => selections[player.userId] === userId
    );
    return acc;
  }, {});
  votingPlayersByDefinitions['DICTIONARY_PLAYER'] = players.filter(
    (player) => selections[player.userId] === 'DICTIONARY_PLAYER'
  );
  return votingPlayersByDefinitions;
};

export const getNumberOfDefinitionToDisplay = (gameState: GameState) =>
  Object.values(gameState.inputEntries)?.length + 1;

export const getEntriesWithUserIdToDisplay = (
  inputEntries: InputDictionaryEntries,
  entry: DictionnaryEntry,
  roomId: string
): [string, InputDictionaryEntry][] => {
  const inputEntriesWithUserIdToDisplay = Object.entries(inputEntries).concat([
    [
      DICTIONARY_PLAYER.userId,
      {
        definition: entry.definition,
        example: entry.example,
        autosave: false,
      },
    ],
  ]);
  const seed = `${entry.word}-${roomId}`;
  return shuffle(inputEntriesWithUserIdToDisplay, seed);
};
