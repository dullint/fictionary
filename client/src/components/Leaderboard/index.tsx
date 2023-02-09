import { Button, Grid, Tooltip, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SocketContext } from '../../App';
import Avatar from '../Avatar';
import { GameContext } from '../Room';
import { isRoomAdmin } from '../WaitingRoom/helpers';
import { calculatePlayerRoundScore } from '../WordResult/helpers';

const Leaderboard = () => {
  const game = useContext(GameContext);
  const players = game.players.getInGamePlayers();
  const scores = game?.scores;
  const selections = game?.selections;
  const socket = useContext(SocketContext);
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

  const previousRoundScores = players.reduce((acc, { username }) => {
    return {
      ...acc,
      [username]: calculatePlayerRoundScore(username, selections),
    };
  }, {});

  const finalScores = players.reduce((acc, { username }) => {
    const previousScore = scores?.[username] ?? 0;
    const roundScore = previousRoundScores?.[username];
    return {
      ...acc,
      [username]: previousScore + roundScore,
    };
  }, {});

  return (
    <Grid
      alignItems="center"
      container
      justifyContent="center"
      direction="column"
      height={1}
    >
      <Typography variant="h4" sx={{ marginTop: 2 }}>
        Leaderboard:
      </Typography>
      <Grid
        container
        justifyContent="center"
        alignItems={'center'}
        sx={{ marginTop: 2, marginBottom: 2, overflowY: 'auto', flex: 1 }}
        maxWidth={500}
      >
        {players &&
          players
            .sort(
              (player1, player2) =>
                finalScores?.[player1.username] -
                finalScores?.[player1.username]
            )
            .map((player) => (
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                sx={{ maxWidth: 130 }}
                key={player?.username}
              >
                <Avatar
                  player={player}
                  size={'medium'}
                  displayBadge={true}
                  badgeContent={finalScores?.[player?.username] ?? 0}
                />
                <Typography variant="subtitle1" align="center">
                  {player?.username}
                </Typography>
              </Grid>
            ))}
      </Grid>
      <Tooltip
        title={
          isAdmin
            ? null
            : 'Only the admin can send everyone to the waiting room'
        }
        placement="top"
        arrow
      >
        <span>
          <Button
            onClick={handleGoToWaitingRoom}
            variant="contained"
            disabled={!isAdmin}
            sx={{ m: 2 }}
          >
            Back to waiting room
          </Button>
        </span>
      </Tooltip>
      <Button onClick={handleLeaveToMenu} sx={{ m: 1 }} variant="outlined">
        Leave to menu
      </Button>
    </Grid>
  );
};

export default Leaderboard;
