import { Player } from '../../../../server/src/player';

export const getAuthorUsernameToDisplay = (
  isTrueDefinition: boolean,
  authorPlayer: Player
) => {
  const authorUsername = isTrueDefinition ? '' : authorPlayer?.username;
  return isTrueDefinition ? authorUsername : `by ${authorUsername}`;
};
