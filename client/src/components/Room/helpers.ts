import { Player } from '../../../../server/src/room/types';

export const getInGamePlayers = (players: Player[]) =>
  players.filter((player) => player.isInGame);
