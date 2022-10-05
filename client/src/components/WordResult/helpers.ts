import { SelectedDefinitions } from '../../../../server/src/game/types';

export const calculatePlayerRoundScore = (
  socketId: string,
  selections: SelectedDefinitions
) => {
  const voteForHimPoints = Object.values(selections).reduce(
    (acc, defSocketId) => acc + Number(defSocketId === socketId),
    0
  );
  const findRightDefPoint = Number(
    selections?.[socketId] === 'REAL_DEFINITION'
  );
  return voteForHimPoints + findRightDefPoint;
};
