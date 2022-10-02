import React, { createContext, useContext, useEffect, useState } from 'react';
import WaitingRoom from '../WaitingRoom';
import { SocketContext } from '../../App';
import { Player } from '@server/src/room/types';
import { useParams } from 'react-router-dom';
import { Game } from '@server/src/game/games';
import WordPrompt from '../WordPrompt';
import Leaderboard from '../Leaderboard';

export const PlayerContext = createContext<Player[]>([]);
export const GameContext = createContext(null);

export enum GameStep {
  WAIT,
  PROMPT,
  GUESS,
  RESULTS,
  FINISHED,
}

const Room = () => {
  const socket = useContext(SocketContext);
  const [players, setPlayers] = useState<Player[]>([]);
  const { roomId } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.emit('players');
      socket.on('players', (players: Player[]) => setPlayers(players));

      socket.emit('game');
      socket.on('game', (game: Game) => {
        console.log(game);
        return setGame(game);
      });
    }
  }, [socket, roomId]);
  console.log(game);

  const renderComponent = (gameStep: GameStep) => {
    switch (gameStep) {
      case GameStep.WAIT:
        return <WaitingRoom />;
      case GameStep.PROMPT:
        return <WordPrompt />;
      case GameStep.GUESS:
        return <WordPrompt />;
      case GameStep.RESULTS:
        return <WordPrompt />;
      case GameStep.FINISHED:
        return <Leaderboard />;
      default:
        return <div>GAME STEP UNDEFINED</div>;
    }
  };

  return (
    <PlayerContext.Provider value={players}>
      <GameContext.Provider value={game}>
        {renderComponent(game?.gameStep)}
      </GameContext.Provider>
    </PlayerContext.Provider>
  );
};

export default Room;
