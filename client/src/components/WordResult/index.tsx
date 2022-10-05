import { Button, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../../App';
import { GameContext, PlayerContext } from '../Room';
import { calculatePlayerRoundScore } from './helpers';

const WordResult = () => {
  const game = useContext(GameContext);
  const scores = game?.scores;
  const selections = game?.selections;
  const socket = useContext(SocketContext);
  const players = useContext(PlayerContext);
  const { roomId } = useParams();

  const handleNextStep = () => {
    socket.emit('update_scores', { roomId, scores: newScores });
    socket.emit('new_round', { roomId });
  };

  const roundScores = players.reduce((acc, player) => {
    return {
      ...acc,
      [player.socketId]: calculatePlayerRoundScore(player.socketId, selections),
    };
  }, {});

  const newScores = players.reduce((acc, player) => {
    const socketId = player.socketId;
    const previousScore = scores?.[socketId] ?? 0;
    const roundScore = roundScores?.[socketId];
    return {
      ...acc,
      [player.socketId]: previousScore + roundScore,
    };
  }, {});

  return (
    <div>
      <h1>Round Results</h1>
      {players.map((player) => {
        const socketId = player.socketId;
        const roundScore = roundScores?.[socketId];
        const newScore = newScores?.[socketId];
        return (
          <Typography>{`${player.username}: ${
            roundScore ? '+' : ''
          }${roundScore} => ${newScore} Points`}</Typography>
        );
      })}
      <Button onClick={handleNextStep}>Continue</Button>
    </div>
  );
};

export default WordResult;
