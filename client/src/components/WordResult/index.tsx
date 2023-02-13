import { Box, Button, Grid, Tooltip, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import { SocketContext } from '../../App';
import Avatar from '../Avatar';
import { RoomContext } from '../Room';
import { isRoomAdmin } from '../WaitingRoom/helpers';
import { calculatePlayerRoundScore } from './helpers';

const WordResult = () => {
  const { gameState, players } = useContext(RoomContext);
  const scores = gameState.scores;
  const selections = gameState.selections;
  const socket = useContext(SocketContext);
  const { roomId } = useParams();
  const isAdmin = isRoomAdmin(players, socket.id);
  const [displayNewScores, setDisplayNewScores] = useState(false);

  useEffect(() => {
    setTimeout(() => setDisplayNewScores(true), 1000);
  }, []);

  const handleNextStep = () => {
    socket.emit('update_scores', { roomId, scores: newScores });
    socket.emit('new_round', { roomId });
  };

  const roundScores = players.reduce((acc, { username }) => {
    return {
      ...acc,
      [username]: calculatePlayerRoundScore(username, selections),
    };
  }, {});

  const newScores = players.reduce((acc, { username }) => {
    const previousScore = scores?.[username] ?? 0;
    const roundScore = roundScores?.[username];
    return {
      ...acc,
      [username]: previousScore + roundScore,
    };
  }, {});

  const displayedScores = displayNewScores ? newScores : scores;

  return (
    <Grid
      alignItems="center"
      container
      justifyContent="space-between"
      direction="column"
      height={1}
      width={1}
    >
      <Typography variant="h4" sx={{ margin: 2 }}>
        Scores:
      </Typography>

      <Grid container spacing={2}>
        {players &&
          players.map((player) => (
            <Grid item xs={4} sm={3} key={player.userId}>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <Avatar
                  player={player}
                  size={'medium'}
                  displayBadge={true}
                  badgeContent={displayedScores?.[player?.username] ?? 0}
                />
                <Typography
                  variant="subtitle1"
                  align="center"
                  textOverflow="ellipsis"
                  overflow={'hidden'}
                  sx={{ flex: 1, width: 1 }}
                >
                  {player?.username}
                </Typography>
              </Box>
            </Grid>
          ))}
      </Grid>

      <Tooltip
        title={isAdmin ? null : 'Waiting for the admin to continue'}
        placement="top"
        arrow
      >
        <span>
          <Button
            onClick={handleNextStep}
            disabled={!isAdmin}
            variant="contained"
            sx={{ marginTop: 1 }}
          >
            Continue
          </Button>
        </span>
      </Tooltip>
    </Grid>
  );
};

export default WordResult;
