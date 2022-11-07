import {
  Definitions,
  DictionnaryEntry,
  SelectedDefinitions,
} from '../../../../server/src/game/types';
import { shuffle } from 'shuffle-seed';

import { Player } from '../../../../server/src/room/types';

export const getMyPlayer = (players: Player[], socketId: string) => {
  return players.filter((player) => player.socketId === socketId)?.[0];
};

export const getVotingPlayersByDefinitions = (
  players: Player[],
  selections: SelectedDefinitions
) => {
  const votingPlayersByDefinitions = players.reduce((acc, { username }) => {
    acc[username] = players.filter(
      (player) => selections[player.username] === username
    );
    return acc;
  }, {});
  votingPlayersByDefinitions['REAL_DEFINITION'] = players.filter(
    (player) => selections[player.username] === 'REAL_DEFINITION'
  );
  return votingPlayersByDefinitions;
};

export const getDefinitionsToDisplay = (
  definitions: Definitions,
  entry: DictionnaryEntry,
  roomId: string
) => {
  const definitionToDisplay = Object.entries(definitions).concat([
    ['REAL_DEFINITION', entry.definition],
  ]);
  const seed = `${entry.word}-${roomId}`;
  return shuffle(definitionToDisplay, seed);
};
