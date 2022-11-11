import { AvatarGroup, Box, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Player } from '../../../../server/room/types';
import Avatar from '../Avatar';
import { getAuthorUsernameToDisplay } from './helpers';

interface PropsType {
  votingPlayers: Player[];
  authorPlayer?: Player;
  size?: 'big' | 'small';
  revealed: boolean;
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
  const pointsNumber =
    isTrueDefinition && votingPlayers.length ? 1 : votingPlayers.length;
  const pointsOrientation = isTrueDefinition ? 'left' : 'right';
  const pointsMessage = pointsNumber
    ? `+ ${pointsNumber} POINT${pointsNumber > 1 ? 'S' : ''}`
    : '';
  return (
    <Grid
      container
      justifyContent={'space-between'}
      alignItems="center"
      sx={{ marginTop: 1 }}
    >
      <AvatarGroup sx={{ marginRight: 2 }}>
        {votingPlayers.map((player) => {
          return <Avatar player={player} size={size} />;
        })}
      </AvatarGroup>
      <Typography
        variant="subtitle1"
        align={pointsOrientation}
        sx={{
          flexGrow: 1,
          textJustify: 'end',
          opacity: Number(showPoints),
          transition: 'transform 700ms ease-in-out',
          transform: showPoints
            ? null
            : `translateX(${isTrueDefinition ? '+' : '-'}50px)`,
          color: 'orange',
        }}
      >
        {pointsMessage}
      </Typography>

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
              variant="subtitle1"
            >
              {getAuthorUsernameToDisplay(isTrueDefinition, authorPlayer)}
            </Typography>
            <Avatar player={authorPlayer} size={size} />
          </Grid>
        )}
      </Box>
    </Grid>
  );
};

export default VoteBanner;
