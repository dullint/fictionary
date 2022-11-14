import { Typography, Grid, Box } from '@mui/material';
import React, { useContext, useState } from 'react';
import { SocketContext } from '../../App';
import { GameContext, PlayerContext } from '../Room';
import { useParams } from 'react-router-dom';
import DefinitionDisplay from '../DefinitionDisplay';
import {
  getDefinitionsToDisplay,
  getVotingPlayersByDefinitions,
} from './helpers';
import VoteBanner from '../VoteBanner';
import GameHeader from '../GameHeader';
import { theme } from '../../theme';

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
  return (
    <Grid container direction="column" height={1} width={1}>
      <GameHeader />
      <Grid direction="column" sx={{ overflowY: 'auto', flex: 1 }}>
        {definitionsToDisplay.map(([username, definition]) => (
          <Grid
            item
            onClick={() => handleSelectDefinition(username)}
            sx={{
              boxSizing: 'border-box',
              border: `2px solid`,
              borderColor:
                username === selectedUsernameDef
                  ? theme.palette.primary.main
                  : 'transparent',
              borderRadius: 2,
              '&:hover': {
                border: '2px solid',
                borderColor:
                  username === selectedUsernameDef
                    ? theme.palette.primary.main
                    : theme.palette.secondary.main,
              },
              padding: 1,
            }}
          >
            <DefinitionDisplay entry={{ ...entry, definition: definition }} />
            <VoteBanner
              votingPlayers={votingPlayersByDefinitions[username] ?? []}
              revealed={false}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default WordGuess;
