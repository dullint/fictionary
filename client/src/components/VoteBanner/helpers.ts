import { Player } from '../../../../server/room/types';

export const getAuthorUsernameToDisplay = (
  isTrueDefinition: boolean,
  authorPlayer: Player
) => {
  const authorUsername = isTrueDefinition ? '' : authorPlayer?.username;
  return isTrueDefinition ? authorUsername : `by ${authorUsername}`;
};

export const getDisplayPoints = (
  revealed: boolean,
  isTrueDefinition: boolean,
  votingPlayers: Player[],
  authorPlayer: Player
): { message: string; orientation: 'left' | 'right' } => {
  if (!revealed) return { orientation: 'left', message: '' };
  const pointsNumber = isTrueDefinition
    ? Math.min(votingPlayers.length, 1)
    : votingPlayers.filter(
        (player) => player.username !== authorPlayer.username
      ).length;
  return {
    orientation: isTrueDefinition ? 'left' : 'right',
    message: pointsNumber
      ? `+ ${pointsNumber} POINT${pointsNumber > 1 ? 'S' : ''}`
      : '',
  };
};
