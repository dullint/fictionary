import {
  Avatar as MUIAvatar,
  Badge,
  Button,
  Grid,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import { SocketContext } from '../../App';
import Avatar from '../Avatar';
import { GameContext, PlayerContext } from '../Room';
import { isRoomAdmin } from '../WaitingRoom/helpers';
import { calculatePlayerRoundScore } from './helpers';

const WordResult = () => {
  const game = useContext(GameContext);
  const scores = game?.scores;
  const selections = game?.selections;
  const socket = useContext(SocketContext);
  const players = useContext(PlayerContext);
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
      justifyContent="center"
      direction="column"
      height={1}
    >
      <Typography variant="h4" sx={{ marginTop: 2 }}>
        Scores:
      </Typography>
      <Grid
        container
        justifyContent="center"
        alignItems={'center'}
        sx={{ marginTop: 2, marginBottom: 2, overflowY: 'auto', flex: 1 }}
        maxWidth={500}
      >
        {players &&
          players.map((player) => (
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              sx={{ maxWidth: 130 }}
            >
              <Avatar
                player={player}
                size={'big'}
                displayBadge={true}
                badgeContent={displayedScores?.[player?.username] ?? 0}
              />
              <Typography variant="subtitle1" align="center">
                {player?.username}
              </Typography>
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
