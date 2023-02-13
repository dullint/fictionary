import React, { createContext, useEffect, useState } from 'react';
import WaitingRoom from '../WaitingRoom';
import { useParams } from 'react-router-dom';
import WordPrompt from '../WordPrompt';
import Leaderboard from '../Leaderboard';
import WordGuess from '../WordGuess';
import WordResult from '../WordResult';
import { joinRoom } from '../../services/room';
import LoadingPage from '../LoadingPage';
import WordReveal from '../WordReveal';
import { ClientRoom, RoomId } from '../../../../server/src/room/types';
import socket from '../../socket';
import { Socket } from 'socket.io-client';

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
  const { roomId } = useParams();
  const [room, setRoom] = useState<ClientRoom>(null);
  const [roomErrorMessage, setRoomErrorMessage] = useState(null);

  useEffect(() => {
    const onRoomEnter = async () => {
      const room = await joinRoom(socket, roomId);
      setRoom(room);
    };

    onRoomEnter().catch((err) => {
      setRoomErrorMessage(err.message);
    });
    socket.on('room_error', (errorMessage) => {
      console.log('room_error');
      setRoomErrorMessage(errorMessage);
      setRoom(null);
    });
    return () => {
      socket.emit('leave_room', { roomId });
    };
  }, [roomId]);

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
          return <LoadingPage roomErrorMessage={roomErrorMessage} />;
      }
    }
    return <LoadingPage roomErrorMessage={roomErrorMessage} />;
  };

  return (
    <RoomContext.Provider value={room}>
      {renderComponent(room?.gameState.gameStep)}
    </RoomContext.Provider>
  );
};

export default Room;
