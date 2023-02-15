import React, { createContext, useEffect, useState } from 'react';
import WaitingRoom from '../WaitingRoom';
import { useParams } from 'react-router-dom';
import WordPrompt from '../WordPrompt';
import Leaderboard from '../Leaderboard';
import WordGuess from '../WordGuess';
import WordResult from '../WordResult';
import { joinRoom } from '../../actions';
import LoadingPage from '../LoadingPage';
import WordReveal from '../WordReveal';
import socket from '../../socket';
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
  const { roomId } = useParams();
  const [room, setRoom] = useState<ClientRoom | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleJoinRoom = async () => {
      await joinRoom(roomId)
        .then((room) => {
          setRoom(room);
        })
        .catch((joinRoomError) => {
          setError(joinRoomError);
          setRoom(null);
        });
    };

    handleJoinRoom();

    socket.on('room_error', (errorMessage) => {
      setError(errorMessage);
      setRoom(null);
    });

    socket.on('connect', () => {
      handleJoinRoom();
    });

    socket.on('room', (room) => {
      console.log('room update', { room });
      setRoom(room);
    });

    return () => {
      socket.emit('leave_room', { roomId });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const roomRenderer = (room: ClientRoom) => {
    const gameStep = room.gameState.gameStep;
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
