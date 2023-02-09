import { Player } from '../../../../server/src/player';

export const isRoomAdmin = (players: Player[], userId: string) =>
  players.filter((player) => player?.userId === userId)?.[0]?.isAdmin;

export const getPlayTooltip = (
  isAdmin: boolean,
  allPlayersHaveAUsername: boolean
) => {
  if (!allPlayersHaveAUsername)
    return 'All Players have not chosen their username';
  if (!isAdmin) return 'Waiting for the admin to launch the game';
  return null;
};
