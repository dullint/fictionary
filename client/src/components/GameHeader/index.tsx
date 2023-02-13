import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext } from 'react';
import { SocketContext } from '../../App';
import Avatar from '../Avatar';
import { RoomContext } from '../Room';

interface PropsType {
  children?: React.ReactNode;
}

const GameHeader = (props: PropsType) => {
  const socket = useContext(SocketContext);
  const { gameState, gameSettings, players } = useContext(RoomContext);
  const roundNumber = gameSettings.roundNumber;
  const currentRound = gameState.round;
  const player = players.find((player) => player.userId === socket.data.userId);
  return (
    <Grid
      container
      justifyContent={'space-between'}
      alignItems="center"
      sx={{ marginBottom: 2 }}
    >
      <Typography variant="h6">{`Round ${currentRound} / ${roundNumber}`}</Typography>
      {props.children}
      <Box display="flex" alignItems={'center'} sx={{ marginRight: 0.5 }}>
        <Typography sx={{ marginRight: 1 }} variant="h6">
          {player?.username}
        </Typography>
        <Avatar
          player={player}
          displayBadge={false}
          size={'small'}
          showCrown={true}
        ></Avatar>
      </Box>
    </Grid>
  );
};

export default GameHeader;
