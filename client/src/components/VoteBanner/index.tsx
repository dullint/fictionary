import { Box, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Player } from '../../../../server/src/room/types';
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
    authorPlayer?.socketId !== 'dictionary' &&
    votingPlayers.filter(
      (player) => player?.username !== authorPlayer?.username
    ).length;
  return (
    <Grid
      container
      justifyContent={'space-between'}
      alignItems="center"
      sx={{
        marginTop: 0.5,
      }}
    >
      <Grid
        container
        sx={{
          marginRight: 1,
          maxWidth: {
            xs: 0.5,
            md: 0.7,
          },
        }}
        spacing={0.5}
      >
        {votingPlayers.map((player) => (
          <Grid item key={`avatar-${player?.username}`}>
            <Avatar
              player={player}
              size={size}
              badgeContent={`+${voterPoints}`}
              displayBadge={showPoints && !!voterPoints}
            />
          </Grid>
        ))}
      </Grid>
      {authorPlayer && (
        <Box
          alignItems={'center'}
          display="flex"
          justifyContent={'end'}
          sx={{
            opacity: Number(revealed),
            transition: 'opacity 400ms',
            flex: 1,
          }}
        >
          <Typography
            sx={{
              marginRight: 1,
              transition: 'transform 400ms',
              transform: revealed ? null : 'translateX(30%)',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              width: 1,
              flex: 1,
            }}
            align="right"
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
        </Box>
      )}
    </Grid>
  );
};

export default VoteBanner;
