import { Button, Grid, Typography } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SocketContext } from '../../App';
import { GameContext, PlayerContext } from '../Room';
import ScoreBar from '../ScoreBar';

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

  const data = players
    .map((player) => {
      const { socketId, username, color } = player;
      return {
        username,
        score: scores?.[socketId] ?? 0,
        color,
      };
    })
    .sort((player1, player2) => player1.score - player2.score)
    .slice(0, 3);

  return (
    <Grid alignItems="center" container justifyContent="center" height={300}>
      <h1>Leaderboard</h1>
      <ScoreBar players={players} scores={scores} />
      <Grid
        alignItems="center"
        container
        justifyContent="center"
        flexDirection={'column'}
      >
        <Button onClick={handleLeaveToMenu}>Leave to menu</Button>
        <Button onClick={handleGoToWaitingRoom}>
          Send Everyone to Waiting Room
        </Button>
      </Grid>
    </Grid>
  );
};

export default Leaderboard;
