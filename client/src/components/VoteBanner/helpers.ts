import { Player } from '../../../../server/room/types';

export const getAuthorUsernameToDisplay = (
  isTrueDefinition: boolean,
  authorPlayer: Player
) => {
  const authorUsername = isTrueDefinition ? '' : authorPlayer?.username;
  return isTrueDefinition ? authorUsername : `by ${authorUsername}`;
};
