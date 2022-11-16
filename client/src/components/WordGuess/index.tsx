import { Grid } from '@mui/material';
import React, { useContext, useState } from 'react';
import { SocketContext } from '../../App';
import { GameContext, PlayerContext } from '../Room';
import { useParams } from 'react-router-dom';
import DefinitionDisplay from '../DefinitionDisplay';
import {
  getEntriesWithUsernameToDisplay,
  getVotingPlayersByDefinitions,
} from './helpers';
import VoteBanner from '../VoteBanner';
import GameHeader from '../GameHeader';
import { theme } from '../../theme';

const WordGuess = () => {
  const game = useContext(GameContext);
  const players = useContext(PlayerContext);
  const inputEntries = game?.inputEntries;
  const entry = game?.entry;
  const selections = game.selections;
  const [selectedUsernameDef, setSelectedUsernameDef] = useState(null);
  const { roomId } = useParams();
  const socket = useContext(SocketContext);
  const isUsingExample = game.gameSettings.useExample;

  const handleSelectDefinition = (username) => {
    setSelectedUsernameDef(username);
    socket.emit('select_definition', { username });
  };
  const inputEntriesToDisplay = getEntriesWithUsernameToDisplay(
    inputEntries,
    entry,
    roomId
  );
  console.log(inputEntriesToDisplay);
  const votingPlayersByDefinitions = getVotingPlayersByDefinitions(
    players,
    selections
  );
  return (
    <Grid container direction="column" height={1} width={1}>
      <GameHeader />
      <Grid direction="column" sx={{ overflowY: 'auto', flex: 1 }}>
        {inputEntriesToDisplay.map(([username, inputEntry]) => (
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
            <DefinitionDisplay
              entry={{
                ...entry,
                definition: inputEntry.definition,
                example: isUsingExample ? inputEntry.example : '',
              }}
            />
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
