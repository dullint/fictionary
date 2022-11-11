import { Button, Grid } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SocketContext } from '../../App';
import { GameContext, PlayerContext } from '../Room';
import ScoreBar from '../ScoreBar';
import { isRoomAdmin } from '../WaitingRoom/helpers';

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
  const isAdmin = isRoomAdmin(players, socket.id);

  return (
    <Grid alignItems="center" container justifyContent="center" height={300}>
      <h1>Leaderboard</h1>
      <ScoreBar
        players={players}
        scores={scores}
        layout="vertical"
        number={3}
      />
      <Grid
        alignItems="center"
        container
        justifyContent="center"
        flexDirection={'column'}
      >
        <Button onClick={handleLeaveToMenu} sx={{ m: 2 }}>
          Leave to menu
        </Button>
        {isAdmin && (
          <Button onClick={handleGoToWaitingRoom}>
            Send Everyone to Waiting Room
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default Leaderboard;
