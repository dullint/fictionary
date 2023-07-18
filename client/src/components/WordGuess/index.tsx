import { Grid, Snackbar, Typography } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import GameHeader from '../GameHeader';
import DefinitionList from '../DefinitionList';
import { getNumberOfDefinitionToDisplay } from '../DefinitionList/helpers';
import { RoomContext } from '../Room';
import { Box } from '@mui/system';
import socket from '../../socket';
import { UserId } from '../../../../server/src/socket/types';
import { getInGamePlayers } from '../Room/helpers';

const WordGuess = () => {
  const [selectedUserIdDef, setSelectedUserIdDef] = useState(null);
  const { gameState, gameSettings, players } = useContext(RoomContext);
  const { selections } = gameState;
  const inGamePlayers = getInGamePlayers(players);

  const definitionsRef = useRef([]);
  const definitionsNumber = getNumberOfDefinitionToDisplay(gameState);
  const showGuessVote = gameSettings?.showGuessVote;

  useEffect(() => {
    definitionsRef.current = definitionsRef.current.slice(0, definitionsNumber);
  }, [definitionsNumber]);

  const handleSelectDefinition = (selectedUserId: UserId) => {
    setSelectedUserIdDef(selectedUserId);
    socket.emit('select_definition', selectedUserId);
  };

  const usersWhoSelectedDefinition = Object.keys(selections);
  const missingInGamePlayersGuesses = inGamePlayers.filter(
    (player) => !usersWhoSelectedDefinition.includes(player.userId)
  );

  return (
    <Grid container direction="column" height={1} width={1}>
      <GameHeader>
        <Box display="flex" flexDirection={'row'}>
          <Typography variant="h6">
            {`${usersWhoSelectedDefinition.length} / ${
              usersWhoSelectedDefinition.length +
              missingInGamePlayersGuesses.length
            }`}
          </Typography>
          <Typography
            variant="h6"
            display={{ xs: 'none', sm: 'block' }}
            sx={{ textIndent: 10 }}
          >
            players
          </Typography>
        </Box>
      </GameHeader>
      <Typography variant={'h6'} color={'primary'}>
        Select a definition:
      </Typography>
      <Box sx={{ overflowY: 'auto', flex: 1 }} width={1}>
        <DefinitionList
          showVoteBanner={showGuessVote}
          handleSelectDefinition={handleSelectDefinition}
          revealedAuthorIndexes={[]}
          selectedUserIdDef={selectedUserIdDef}
          definitionHover={true}
          definitionsRef={definitionsRef}
          revealedBannerIndexes={[]}
        />
        <Box margin={2}></Box>
      </Box>
      <Snackbar
        message={'Submitted! Waiting for other players...'}
        open={selectedUserIdDef}
      />
    </Grid>
  );
};

export default WordGuess;
