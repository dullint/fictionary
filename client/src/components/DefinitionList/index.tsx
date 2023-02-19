import React, { MutableRefObject, useContext } from 'react';
import { RoomContext } from '../Room';
import { useParams } from 'react-router-dom';
import { getVotingPlayersByDefinitions } from './helpers';
import VoteBanner from '../VoteBanner';
import { getEntriesWithUserIdToDisplay } from './helpers';
import { Box } from '@mui/system';
import DefinitionRender from '../DefinitionRender';
import { DICTIONARY_PLAYER } from './constants';
import { theme } from '../../theme';
import AnimateHeight from 'react-animate-height';

interface PropsType {
  handleSelectDefinition: (string) => void;
  revealedAuthorIndexes: number[];
  selectedUserIdDef: string | null;
  definitionHover: boolean;
  definitionsRef: MutableRefObject<unknown[]>;
  showVoteBanner: boolean;
  revealedBannerIndexes: number[];
}

const DefinitionList = (props: PropsType) => {
  const {
    handleSelectDefinition,
    revealedAuthorIndexes,
    selectedUserIdDef,
    definitionHover,
    definitionsRef,
    showVoteBanner,
    revealedBannerIndexes,
  } = props;
  const { gameState, players, gameSettings } = useContext(RoomContext);
  const { inputEntries, entry, selections } = gameState;
  const { roomId } = useParams();
  const isUsingExample = gameSettings.useExample;

  const inputEntriesToDisplay = getEntriesWithUserIdToDisplay(
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
      {inputEntriesToDisplay.map(([userId, inputEntry], index) => (
        <Box
          display="flex"
          onClick={() => handleSelectDefinition(userId)}
          flexDirection={'column'}
          key={`definition-${userId}`}
          ref={(el) => (definitionsRef.current[index] = el)}
          sx={{
            border: `2px solid`,
            borderColor:
              userId === selectedUserIdDef
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
          {showVoteBanner && (
            <AnimateHeight
              height={revealedBannerIndexes.includes(index) ? 'auto' : 0}
              duration={700}
            >
              <VoteBanner
                votingPlayers={votingPlayersByDefinitions[userId] ?? []}
                authorPlayer={extendedPlayers.find(
                  (player) => player.userId === userId
                )}
                size={'small'}
                revealed={revealedAuthorIndexes.includes(index)}
              />
            </AnimateHeight>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default DefinitionList;
