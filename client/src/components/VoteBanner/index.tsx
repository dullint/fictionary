import { Avatar, AvatarGroup, Box, Grid, Typography } from '@mui/material';
import React from 'react';
import { Player } from '../../../../server/src/room/types';

interface PropsType {
  votingPlayers: Player[];
  authorPlayer?: Player;
}

const VoteBanner = (props: PropsType) => {
  const { votingPlayers, authorPlayer } = props;
  return (
    <Grid container justifyContent={'space-between'} alignItems="center">
      <AvatarGroup>
        {votingPlayers.map((player) => {
          return (
            <Avatar sx={{ height: 20, width: 20, bgcolor: player.color }} />
          );
        })}
      </AvatarGroup>
      {authorPlayer && (
        <Box>
          <Typography>{authorPlayer.username}</Typography>
          <Avatar sx={{ height: 20, width: 20, bgcolor: authorPlayer.color }} />
        </Box>
      )}
    </Grid>
  );
};

export default VoteBanner;
