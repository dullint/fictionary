import { GamePlayer } from '../../../../server/src/room/types';

export const isRoomAdmin = (players: GamePlayer[], socketId: string) =>
  players.filter((player) => player?.socketId === socketId)?.[0]?.isAdmin;

export const getPlayTooltip = (
  isAdmin: boolean,
  allPlayersHaveAUsername: boolean
) => {
  if (!allPlayersHaveAUsername)
    return 'All Players have not chosen their username';
  if (!isAdmin) return 'Waiting for the admin to launch the game';
  return null;
};
