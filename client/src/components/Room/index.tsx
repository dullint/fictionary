import React, { createContext, useEffect, useState } from 'react';
import WaitingRoom from '../WaitingRoom';
import { useParams } from 'react-router-dom';
import WordPrompt from '../WordPrompt';
import Leaderboard from '../Leaderboard';
import WordGuess from '../WordGuess';
import WordResult from '../WordResult';
import LoadingPage from '../LoadingPage';
import WordReveal from '../WordReveal';
import socket from '../../socket';
import { ClientRoom } from '../../../../server/src/room/types';
import { ServerResponse } from '../../../../server/src/socket/types';
import WordCarousel from '../WordCarousel';

export const RoomContext = createContext<ClientRoom>(null);

export enum GameStep {
  WAIT,
  PROMPT,
  SHOW,
  GUESS,
  REVEAL,
  RESULTS,
  FINISHED,
}

const Room = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState<ClientRoom | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleJoinRoom = (roomId: string) => {
    if (roomId) {
      const callback = (response: ServerResponse) => {
        const { error, success } = response;
        if (!success) setError(error);
      };
      socket.emit('join_room', roomId, callback);
    }
  };

  useEffect(() => {
    handleJoinRoom(roomId);

    socket.on('room_error', (errorMessage) => {
      setError(errorMessage);
      setRoom(null);
    });

    socket.on('connect', () => {
      handleJoinRoom(roomId);
    });

    socket.on('room', (room) => {
      setRoom(room);
    });

    return () => {
      socket.emit('leave_room', { roomId });
    };
  }, [roomId]);

  const roomRenderer = (room: ClientRoom) => {
    const gameStep = room.gameState.gameStep;
    switch (gameStep) {
      case GameStep.WAIT:
        return <WaitingRoom />;
      case GameStep.PROMPT:
        return <WordPrompt />;
      case GameStep.SHOW:
        return <WordCarousel />;
      case GameStep.GUESS:
        return <WordGuess />;
      case GameStep.REVEAL:
        return <WordReveal />;
      case GameStep.RESULTS:
        return <WordResult />;
      case GameStep.FINISHED:
        return <Leaderboard />;
      default:
        return <LoadingPage error={error} />;
    }
  };

  return room ? (
    <RoomContext.Provider value={room}>
      {roomRenderer(room)}
    </RoomContext.Provider>
  ) : (
    <LoadingPage error={error} />
  );
};

export default Room;
