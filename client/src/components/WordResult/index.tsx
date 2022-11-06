import { Box, Button, Grid, Tooltip, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import { SocketContext } from '../../App';
import { GameContext, PlayerContext } from '../Room';
import ScoreBar from '../ScoreBar';
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

  return (
    <Grid
      alignItems="center"
      container
      justifyContent="center"
      height={players.length * 150}
    >
      <Typography variant="subtitle1">New Scores after this round:</Typography>
      <ScoreBar
        players={players}
        scores={displayNewScores ? newScores : scores}
        animate={displayNewScores}
      />
      <Tooltip
        title={isAdmin ? null : 'Waiting for the admin to continue'}
        placement="top"
      >
        <span>
          <Button onClick={handleNextStep} disabled={!isAdmin}>
            Continue
          </Button>
        </span>
      </Tooltip>
    </Grid>
  );
};

export default WordResult;
