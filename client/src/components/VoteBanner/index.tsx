import { AvatarGroup, Box, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Player } from '../../../../server/room/types';
import Avatar from '../Avatar';
import { getAuthorUsernameToDisplay } from './helpers';

interface PropsType {
  votingPlayers: Player[];
  authorPlayer?: Player;
  revealed: boolean;
  size?: 'big' | 'small' | 'medium';
}

const VoteBanner = (props: PropsType) => {
  const { votingPlayers, authorPlayer, size = 'small', revealed } = props;
  const [showPoints, setShowPoints] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowPoints(revealed);
      clearTimeout(timeout);
    }, 400);
  }, [revealed]);

  const isTrueDefinition = authorPlayer?.socketId === 'dictionary';
  const voterPoints = Number(isTrueDefinition);
  const authorPoints =
    authorPlayer?.username &&
    authorPlayer.socketId !== 'dictionary' &&
    votingPlayers.filter((player) => player.username !== authorPlayer.username)
      .length;
  return (
    <Grid
      container
      justifyContent={'space-between'}
      alignItems="center"
      sx={{ marginTop: 1 }}
    >
      <AvatarGroup sx={{ marginRight: 1 }} max={6}>
        {votingPlayers.map((player) => (
          <Avatar
            player={player}
            size={size}
            badgeContent={`+${voterPoints}`}
            displayBadge={showPoints && !!voterPoints}
          />
        ))}
      </AvatarGroup>
      <Box
        sx={{
          opacity: Number(revealed),
          transition: 'opacity 400ms',
        }}
      >
        {authorPlayer && (
          <Grid container alignItems={'center'}>
            <Typography
              sx={{
                marginRight: 1,
                marginLeft: 2,
                transition: 'transform 400ms',
                transform: revealed ? null : 'translateX(30%)',
              }}
              variant="subtitle2"
            >
              {getAuthorUsernameToDisplay(isTrueDefinition, authorPlayer)}
            </Typography>
            <Avatar
              player={authorPlayer}
              size={size}
              badgeContent={`+${authorPoints}`}
              displayBadge={showPoints && !!authorPoints}
            />
          </Grid>
        )}
      </Box>
    </Grid>
  );
};

export default VoteBanner;
