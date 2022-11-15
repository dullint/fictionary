import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext } from 'react';
import { SocketContext } from '../../App';
import Avatar from '../Avatar';
import { GameContext, PlayerContext } from '../Room';
import { getMyPlayer } from '../WordGuess/helpers';

const GameHeader = () => {
  const players = useContext(PlayerContext);
  const socket = useContext(SocketContext);
  const game = useContext(GameContext);
  const roundNumber = game.gameSettings.roundNumber;
  const currentRound = game.round;
  const player = getMyPlayer(players, socket.id);
  return (
    <Grid
      container
      justifyContent={'space-between'}
      alignItems="center"
      sx={{ marginBottom: 2 }}
    >
      <Typography variant="h6">{`Round ${currentRound} / ${roundNumber}`}</Typography>
      <Box display="flex" alignItems={'center'} sx={{ marginRight: 2 }}>
        <Typography sx={{ marginRight: 1 }} variant="h6">
          {player?.username}
        </Typography>
        <Avatar player={player} displayBadge={false} size={'small'}></Avatar>
      </Box>
    </Grid>
  );
};

export default GameHeader;
