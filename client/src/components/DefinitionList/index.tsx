import React, { MutableRefObject, useContext } from 'react';
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
  revealedAuthorIndexes: number[];
  selectedUsernameDef: string | null;
  definitionHover: boolean;
  definitionsRef: MutableRefObject<unknown[]>;
  showVoteBanner: boolean;
  revealedBannerIndexes: number[];
}

const DefinitionList = (props: PropsType) => {
  const {
    handleSelectDefinition,
    revealedAuthorIndexes,
    selectedUsernameDef,
    definitionHover,
    definitionsRef,
    showVoteBanner,
    revealedBannerIndexes,
  } = props;
  const game = useContext(GameContext);
  const players = useContext(PlayerContext);
  const inputEntries = game?.inputEntries;
  const entry = game?.entry;
  const selections = game.selections;
  const { roomId } = useParams();
  const isUsingExample = game.gameSettings.useExample;

  const inputEntriesToDisplay = getEntriesWithUsernameToDisplay(
    inputEntries,
    entry,
    roomId
  );

  const votingPlayersByDefinitions = getVotingPlayersByDefinitions(
    players,
    selections
  );

  const extendedPlayers = players.concat(DICTIONARY_PLAYER);

  return (
    <Box display="flex" flexDirection="column">
      {inputEntriesToDisplay.map(([username, inputEntry], index) => (
        <Box
          display="flex"
          onClick={() => handleSelectDefinition(username)}
          flexDirection={'column'}
          key={`definition-${username}`}
          ref={(el) => (definitionsRef.current[index] = el)}
          sx={{
            border: `2px solid`,
            borderColor:
              username === selectedUsernameDef
                ? theme.palette.primary.main
                : 'transparent',
            borderRadius: 2,
            '&:hover': {
              backgroundColor: definitionHover
                ? theme.palette.yellow.darker
                : 'transparent',
            },
            p: 0.5,
          }}
        >
          <DefinitionRender
            entry={{
              ...entry,
              definition: inputEntry.definition,
              example: isUsingExample ? inputEntry.example : '',
            }}
          />
          {showVoteBanner && revealedBannerIndexes.includes(index) && (
            <VoteBanner
              votingPlayers={votingPlayersByDefinitions[username] ?? []}
              authorPlayer={extendedPlayers.find(
                (player) => player?.username === username
              )}
              size={'small'}
              revealed={revealedAuthorIndexes.includes(index)}
            />
          )}
        </Box>
      ))}
    </Box>
  );
};

export default DefinitionList;
