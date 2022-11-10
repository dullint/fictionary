import { SelectedDefinitions } from '../../../../server/game/types';

export const calculatePlayerRoundScore = (
  username: string,
  selections: SelectedDefinitions
) => {
  const voteForHimPoints = Object.values(selections).reduce(
    (acc, votedUsername) => acc + Number(votedUsername === username),
    0
  );
  const findRightDefPoint = Number(
    selections?.[username] === 'REAL_DEFINITION'
  );
  return voteForHimPoints + findRightDefPoint;
};
