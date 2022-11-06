import React, { createContext, useContext, useEffect, useState } from 'react';
import WaitingRoom from '../WaitingRoom';
import { SocketContext } from '../../App';
import { Player } from '@server/src/room/types';
import { useNavigate, useParams } from 'react-router-dom';
import { Game } from '@server/src/game/games';
import WordPrompt from '../WordPrompt';
import Leaderboard from '../Leaderboard';
import WordGuess from '../WordGuess';
import WordResult from '../WordResult';
import { joinGameAndQueryInfo } from '../../services/room';
import LoadingPage from '../LoadingPage';

export const PlayerContext = createContext<Player[]>([]);
export const GameContext = createContext<Game>(null);

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
  const [joinErrorMessage, setJoinErrorMessage] = useState(null);

  useEffect(() => {
    if (socket) {
      const onRoomEnter = async () => {
        const { game, players } = await joinGameAndQueryInfo(socket, roomId);
        console.log({ players });
        setGame(game);
        setPlayers(players);
      };
      onRoomEnter().catch((err) => {
        setJoinErrorMessage(err.message);
      });
      socket.on('players', (players: Player[]) => setPlayers(players));
      socket.on('game', (game: Game) => setGame(game));
    }
  }, [socket, roomId]);

  const renderComponent = (gameStep: GameStep) => {
    switch (gameStep) {
      case GameStep.WAIT:
        return <WaitingRoom />;
      case GameStep.PROMPT:
        return <WordPrompt />;
      case GameStep.GUESS:
        return <WordGuess />;
      case GameStep.RESULTS:
        return <WordResult />;
      case GameStep.FINISHED:
        return <Leaderboard />;
      default:
        return <LoadingPage joinErrorMessage={joinErrorMessage} />;
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
