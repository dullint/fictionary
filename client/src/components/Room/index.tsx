import React, { createContext, useContext, useEffect, useState } from 'react';
import WaitingRoom from '../WaitingRoom';
import { SocketContext } from '../../App';
import { ConnectedPlayer } from '../../../../server/src/room/types';
import { useParams } from 'react-router-dom';
import { Game } from '../../../../server/src/game/gameManager';
import WordPrompt from '../WordPrompt';
import Leaderboard from '../Leaderboard';
import WordGuess from '../WordGuess';
import WordResult from '../WordResult';
import { joinRoom, queryRoomInfo } from '../../services/room';
import LoadingPage from '../LoadingPage';
import WordReveal from '../WordReveal';

export const ConnectedPlayersContext = createContext<ConnectedPlayer[]>([]);
export const GameContext = createContext<Game>(null);

export enum GameStep {
  WAIT,
  PROMPT,
  GUESS,
  REVEAL,
  RESULTS,
  FINISHED,
}

const Room = () => {
  const socket = useContext(SocketContext);
  const [connectedPlayers, setConnectedPlayers] = useState<ConnectedPlayer[]>(
    []
  );
  const { roomId } = useParams();
  const [game, setGame] = useState(null);
  const [joinErrorMessage, setJoinErrorMessage] = useState(null);

  useEffect(() => {
    const onRoomEnter = async () => {
      await joinRoom(socket, roomId);
      const { connectedPlayers, game } = await queryRoomInfo(socket, roomId);
      console.log({ connectedPlayers, game });
      setGame(game);
      setConnectedPlayers(connectedPlayers);
    };

    if (socket && socket?.id) {
      onRoomEnter().catch((err) => {
        setJoinErrorMessage(err.message);
      });
    }
  }, [roomId, socket, socket?.id]);

  useEffect(() => {
    if (socket && socket?.id) {
      socket.on('connectedPlayers', (connectedPlayers: ConnectedPlayer[]) =>
        setConnectedPlayers(connectedPlayers)
      );
      socket.on('game', (game: Game) => {
        setGame(game);
        console.log({ connectedPlayers, game });
      });
      return () => socket.emit('leave_room', { roomId });
    }
  }, [socket, roomId, socket?.id]);

  const renderComponent = (gameStep: GameStep) => {
    if (game && connectedPlayers) {
      switch (gameStep) {
        case GameStep.WAIT:
          return <WaitingRoom />;
        case GameStep.PROMPT:
          return <WordPrompt />;
        case GameStep.GUESS:
          return <WordGuess />;
        case GameStep.REVEAL:
          return <WordReveal />;
        case GameStep.RESULTS:
          return <WordResult />;
        case GameStep.FINISHED:
          return <Leaderboard />;
        default:
          return <LoadingPage joinErrorMessage={joinErrorMessage} />;
      }
    }
    return <LoadingPage joinErrorMessage={joinErrorMessage} />;
  };

  return (
    <ConnectedPlayersContext.Provider value={connectedPlayers}>
      <GameContext.Provider value={game}>
        {renderComponent(game?.gameStep)}
      </GameContext.Provider>
    </ConnectedPlayersContext.Provider>
  );
};

export default Room;
