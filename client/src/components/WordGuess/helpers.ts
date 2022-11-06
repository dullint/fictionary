import { SelectedDefinitions } from '../../../../server/src/game/types';
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
