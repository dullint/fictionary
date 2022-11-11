import { SelectedDefinitions } from '../../../../server/game/types';

export const calculatePlayerRoundScore = (
  username: string,
  selections: SelectedDefinitions
) => {
  const voteForHimPoints = Object.entries(selections).reduce(
    (acc, [voterUsername, votedUsername]) =>
      acc + Number(votedUsername === username && voterUsername !== username),
    0
  );
  const findRightDefPoint = Number(
    selections?.[username] === 'REAL_DEFINITION'
  );
  return voteForHimPoints + findRightDefPoint;
};
