import { Grid } from '@mui/material';
import React, { useContext, useEffect, useRef } from 'react';
import { GameContext, PlayerContext } from '../Room';
import { useParams } from 'react-router-dom';
import { getVotingPlayersByDefinitions } from './helpers';
import VoteBanner from '../VoteBanner';
import { getEntriesWithUsernameToDisplay } from './helpers';
import { Box } from '@mui/system';
import DefinitionRender from '../DefinitionRender';
import { DICTIONARY_PLAYER } from './constants';
import { theme } from '../../theme';

interface PropsType {
  handleSelectDefinition: (string) => void;
  revealedUsername: string[];
  selectedUsernameDef: string | null;
  definitionHover: boolean;
}

const DefinitionList = (props: PropsType) => {
  const {
    handleSelectDefinition,
    revealedUsername,
    selectedUsernameDef,
    definitionHover,
  } = props;
  const game = useContext(GameContext);
  const players = useContext(PlayerContext);
  const inputEntries = game?.inputEntries;
  const entry = game?.entry;
  const selections = game.selections;
  const { roomId } = useParams();
  const definitionsRef = useRef([]);
  const isUsingExample = game.gameSettings.useExample;

  const inputEntriesToDisplay = getEntriesWithUsernameToDisplay(
    inputEntries,
    entry,
    roomId
  );

  useEffect(() => {
    definitionsRef.current = definitionsRef.current.slice(
      0,
      inputEntriesToDisplay.length
    );
  }, [inputEntriesToDisplay]);

  const votingPlayersByDefinitions = getVotingPlayersByDefinitions(
    players,
    selections
  );

  const extendedPlayers = players.concat(DICTIONARY_PLAYER);

  return (
    <Box
      display="flex"
      width={1}
      flexDirection="column"
      sx={{
        overflowY: 'auto',
        flex: 1,
      }}
    >
      {inputEntriesToDisplay.map(([username, inputEntry], index) => (
        <Box
          display="flex"
          onClick={() => handleSelectDefinition(username)}
          flexDirection={'column'}
          key={`definition-${username}`}
          ref={(el) => (definitionsRef.current[index] = el)}
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
              borderColor: definitionHover
                ? username === selectedUsernameDef
                  ? theme.palette.primary.main
                  : theme.palette.secondary.main
                : 'transparent',
            },
            padding: 1,
          }}
        >
          <DefinitionRender
            entry={{
              ...entry,
              definition: inputEntry.definition,
              example: isUsingExample ? inputEntry.example : '',
            }}
          />
          <VoteBanner
            votingPlayers={votingPlayersByDefinitions[username] ?? []}
            authorPlayer={extendedPlayers.find(
              (player) => player?.username === username
            )}
            size={'small'}
            revealed={revealedUsername.includes(username)}
          />
        </Box>
      ))}
    </Box>
  );
};

export default DefinitionList;
