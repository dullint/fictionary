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
import { BOTTOM_MAIN_BUTTON_WIDTH } from '../Room/constants';
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
      <Grid
        container
        width={1}
        direction="column"
        sx={{ overflowY: 'auto', flex: 1, padding: 1 }}
        spacing={1}
      >
        {definitionsToDisplay.map(([username, definition]) => (
          <Box
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
          </Box>
        ))}
        <Typography
          variant="body1"
          sx={{ m: 1, width: BOTTOM_MAIN_BUTTON_WIDTH }}
        >
          {selectedUsernameDef
            ? 'Waiting for other players to pick a definition'
            : null}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default WordGuess;
