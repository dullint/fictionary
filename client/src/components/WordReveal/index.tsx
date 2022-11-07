import { Typography, Grid, Tooltip, Button } from '@mui/material';
import React, { useContext } from 'react';
import { SocketContext } from '../../App';
import { GameContext, PlayerContext } from '../Room';
import { useParams } from 'react-router-dom';
import DefinitionDisplay from '../DefinitionDisplay';
import { getVotingPlayersByDefinitions } from '../WordGuess/helpers';
import VoteBanner from '../VoteBanner';
import { getDefinitionsToDisplay } from '../WordGuess/helpers';
import { isRoomAdmin } from '../WaitingRoom/helpers';

const WordReveal = () => {
  const game = useContext(GameContext);
  const players = useContext(PlayerContext);
  const definitions = game?.definitions;
  const entry = game?.entry;
  const selections = game.selections;
  const { roomId } = useParams();
  const socket = useContext(SocketContext);
  const isAdmin = isRoomAdmin(players, socket.id);

  const handleNextStep = () => {
    socket.emit('show_results');
  };

  const definitionsToDisplay = getDefinitionsToDisplay(
    definitions,
    entry,
    roomId
  );
  const votingPlayersByDefinitions = getVotingPlayersByDefinitions(
    players,
    selections
  );
  return (
    <Grid container direction="column">
      <Grid container direction="column">
        {definitionsToDisplay.map(([username, definition]) => (
          <Grid
            item
            sx={{
              boxSizing: 'border-box',
              borderRadius: 2,
              padding: 1,
            }}
          >
            <DefinitionDisplay
              word={entry.word}
              definition={definition}
              type={entry.type}
            />
            <VoteBanner
              votingPlayers={votingPlayersByDefinitions[username] ?? []}
            />
          </Grid>
        ))}
      </Grid>
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

export default WordReveal;
