import { SelectedDefinitions } from '../../../../server/src/game/types';

export const calculatePlayerRoundScore = (
  userId: string,
  selections: SelectedDefinitions
) => {
  const voteForHimPoints = Object.entries(selections).reduce(
    (acc, [voterUserId, votedUserId]) =>
      acc + Number(votedUserId === userId && voterUserId !== userId),
    0
  );
  const findRightDefPoint = Number(
    selections?.[userId] === 'DICTIONARY_PLAYER'
  );
  return voteForHimPoints + findRightDefPoint;
};
