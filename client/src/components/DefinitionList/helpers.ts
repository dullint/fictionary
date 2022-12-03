import {
  InputDictionaryEntries,
  InputDictionaryEntry,
  SelectedDefinitions,
} from '../../../../server/src/game/types';
import { shuffle } from 'shuffle-seed';

import { Player } from '../../../../server/src/room/types';
import { DictionnaryEntry } from '../../../../server/src/dictionary/types';
import { DICTIONARY_PLAYER } from './constants';
import { Game } from '../../../../server/src/game/gameManager';

export const getMyPlayer = (players: Player[], socketId: string) => {
  return players.filter((player) => player?.socketId === socketId)?.[0];
};

export const getVotingPlayersByDefinitions = (
  players: Player[],
  selections: SelectedDefinitions
) => {
  const votingPlayersByDefinitions = players.reduce((acc, { username }) => {
    acc[username] = players.filter(
      (player) => selections[player?.username] === username
    );
    return acc;
  }, {});
  votingPlayersByDefinitions['REAL_DEFINITION'] = players.filter(
    (player) => selections[player?.username] === 'REAL_DEFINITION'
  );
  return votingPlayersByDefinitions;
};

export const getNumberOfDefinitionToDisplay = (game: Game) =>
  Object.values(game?.inputEntries)?.length + 1;

export const getEntriesWithUsernameToDisplay = (
  inputEntries: InputDictionaryEntries,
  entry: DictionnaryEntry,
  roomId: string
): [string, InputDictionaryEntry][] => {
  const inputEntriesWithUsernameToDisplay = Object.entries(inputEntries).concat(
    [
      [
        DICTIONARY_PLAYER.username,
        {
          definition: entry.definition,
          example: entry.example,
          autosave: false,
        },
      ],
    ]
  );
  const seed = `${entry.word}-${roomId}`;
  return shuffle(inputEntriesWithUsernameToDisplay, seed);
};
