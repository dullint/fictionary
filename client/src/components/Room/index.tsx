import React, { createContext, useContext, useEffect, useState } from 'react';
import WaitingRoom from '../WaitingRoom';
import { SocketContext } from '../../App';
import { useParams } from 'react-router-dom';
import WordPrompt from '../WordPrompt';
import Leaderboard from '../Leaderboard';
import WordGuess from '../WordGuess';
import WordResult from '../WordResult';
import { joinRoom } from '../../services/room';
import LoadingPage from '../LoadingPage';
import WordReveal from '../WordReveal';
import { ClientRoom } from '../../../../server/src/room/types';

export const RoomContext = createContext<ClientRoom>(null);

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
  const { roomId } = useParams();
  const [room, setRoom] = useState<ClientRoom>(null);
  const [joinErrorMessage, setJoinErrorMessage] = useState(null);

  useEffect(() => {
    const onRoomEnter = async () => {
      const room = await joinRoom(socket, roomId);
      setRoom(room);
    };

    if (socket && socket?.id) {
      onRoomEnter().catch((err) => {
        setJoinErrorMessage(err.message);
      });
    }
  }, [roomId, socket, socket?.id]);

  useEffect(() => {
    if (socket && socket?.id) {
      // socket.on('room', (game: Game) => setRoom(game));
      return () => socket.emit('leave_room', { roomId });
    }
  }, [socket, roomId, socket?.id]);

  const renderComponent = (gameStep: GameStep) => {
    if (room) {
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
    <RoomContext.Provider value={room}>
      {renderComponent(room?.gameState.gameStep)}
    </RoomContext.Provider>
  );
};

export default Room;
