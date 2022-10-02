import React, { createContext, useContext, useEffect, useState } from 'react';
import WordPrompt from '../WordPrompt';
import { SocketContext } from '../../App';
import Leaderboard from '../Leaderboard';
import { useParams } from 'react-router-dom';
// import { GameStep } from '../../../../server/src/game/types';

export enum GameStep {
  WAIT,
  PROMPT,
  GUESS,
  RESULTS,
  FINISHED,
}

export const GameContext = createContext(null);

const InPlay = () => {
  const [game, setGame] = useState(null);
  const socket = useContext(SocketContext);
  const { roomId } = useParams();

  useEffect(() => {
    if (socket) {
      socket.emit('game', { roomId });
      socket.on('game', (game) => setGame(game));
    }
  }, [socket, roomId]);

  const renderComponent = (gameStep: GameStep) => {
    switch (gameStep) {
      case GameStep.PROMPT:
        return <WordPrompt />;
      case GameStep.GUESS:
        return <WordPrompt />;
      case GameStep.RESULTS:
        return <WordPrompt />;
      case GameStep.FINISHED:
        return <Leaderboard />;
      default:
        return <></>;
    }
  };

  return (
    <GameContext.Provider value={game}>
      {renderComponent(game?.gameStep)}
    </GameContext.Provider>
  );
};

export default InPlay;
