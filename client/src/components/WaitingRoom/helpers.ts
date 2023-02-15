import { Player } from '../../../../server/src/player';
import { localSocketUserId } from '../../socket';

export const getMyPlayer = (players: Player[]) =>
  players.find((player) => player.userId === localSocketUserId);

export const getPlayTooltip = (
  isAdmin: boolean,
  allPlayersHaveAUsername: boolean
) => {
  if (!allPlayersHaveAUsername)
    return 'All Players have not chosen their username';
  if (!isAdmin) return 'Waiting for the admin to launch the game';
  return null;
};
