import {
  InputDictionaryEntries,
  InputDictionaryEntry,
  SelectedDefinitions,
} from '../../../../server/src/game/types';
import { shuffle } from 'shuffle-seed';

import { DictionnaryEntry } from '../../../../server/src/dictionary/types';
import { DICTIONARY_PLAYER } from './constants';
import { Game } from '../../../../server/src/game';
import { Player } from '../../../../server/src/player';

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
