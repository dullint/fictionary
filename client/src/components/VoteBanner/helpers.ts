import { GamePlayer } from '../../../../server/src/room/types';

export const getAuthorUsernameToDisplay = (
  isTrueDefinition: boolean,
  authorPlayer: GamePlayer
) => {
  const authorUsername = isTrueDefinition ? '' : authorPlayer?.username;
  return isTrueDefinition ? authorUsername : `by ${authorUsername}`;
};
