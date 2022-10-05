import { Button, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SocketContext } from '../../App';
import { GameContext, PlayerContext } from '../Room';

const Leaderboard = () => {
  const game = useContext(GameContext);
  const scores = game?.scores;
  const socket = useContext(SocketContext);
  const players = useContext(PlayerContext);
  const navigate = useNavigate();
  const { roomId } = useParams();

  const handleLeaveToMenu = () => {
    socket.emit('leave_room', { roomId });
    navigate('/');
  };

  const handleGoToWaitingRoom = () => {
    socket.emit('reset_game', { roomId });
  };

  console.log(game);

  return (
    <div>
      <h1>Leaderboard</h1>
      {players.map((player) => {
        const socketId = player.socketId;
        const score = scores?.[socketId];
        return <Typography>{`${player.username}: ${score} Points`}</Typography>;
      })}
      <Button onClick={handleLeaveToMenu}>Leave to menu</Button>
      <Button onClick={handleGoToWaitingRoom}>
        Send Everyone to Waiting Room
      </Button>
    </div>
  );
};

export default Leaderboard;
