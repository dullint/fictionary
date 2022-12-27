import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext } from 'react';
import { SocketContext } from '../../App';
import Avatar from '../Avatar';
import { GameContext, ConnectedPlayersContext } from '../Room';
import { getMyPlayer } from '../DefinitionList/helpers';

interface PropsType {
  children?: React.ReactNode;
}

const GameHeader = (props: PropsType) => {
  const connectPlayers = useContext(ConnectedPlayersContext);
  const socket = useContext(SocketContext);
  const game = useContext(GameContext);
  const roundNumber = game.gameSettings.roundNumber;
  const currentRound = game.round;
  const player = getMyPlayer(connectPlayers, socket.id);
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
