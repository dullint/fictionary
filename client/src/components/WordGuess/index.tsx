import { Typography, Grid } from '@mui/material';
import React, { useContext, useState } from 'react';
import { SocketContext } from '../../App';
import { GameContext, PlayerContext } from '../Room';
import { useParams } from 'react-router-dom';
import DefinitionDisplay from '../DefinitionDisplay';
import {
  getDefinitionsToDisplay,
  getMyPlayer,
  getVotingPlayersByDefinitions,
} from './helpers';
import VoteBanner from '../VoteBanner';

const WordGuess = () => {
  const game = useContext(GameContext);
  const players = useContext(PlayerContext);
  const definitions = game?.definitions;
  const entry = game?.entry;
  const selections = game.selections;
  const [selectedUsernameDef, setSelectedUsernameDef] = useState(null);
  const { roomId } = useParams();
  const socket = useContext(SocketContext);

  const handleSelectDefinition = (username) => {
    setSelectedUsernameDef(username);
    socket.emit('select_definition', { username });
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
  const playerColor = getMyPlayer(players, socket.id).color;
  return (
    <Grid container direction="column">
      <Typography variant="subtitle1" sx={{ m: 2 }}>
        Guess the Right Word!
      </Typography>
      <Grid container direction="column">
        {definitionsToDisplay.map(([username, definition]) => (
          <Grid
            item
            onClick={() => handleSelectDefinition(username)}
            sx={{
              boxShadow:
                username === selectedUsernameDef
                  ? `0px 0px 7px ${playerColor}`
                  : '',
              boxSizing: 'border-box',
              borderRadius: 2,
              '&:hover': {
                boxShadow:
                  username === selectedUsernameDef
                    ? `0px 0px 7px ${playerColor}`
                    : `0px 0px 10px -5px black`,
              },
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
              revealed={false}
            />
          </Grid>
        ))}
        <Typography variant="body1" sx={{ m: 1 }}>
          {selectedUsernameDef
            ? 'Waiting for other players to pick a definition'
            : null}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default WordGuess;
