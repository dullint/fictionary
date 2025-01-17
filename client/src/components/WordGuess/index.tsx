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
import { theme } from '../../theme';
import { ReactComponent as AlarmIcon } from '../../img/alarm.svg';
import { getGuessingTime } from './helpers';

const WordGuess = () => {
  const [selectedUserIdDef, setSelectedUserIdDef] = useState(null);

  const { gameState, gameSettings, players } = useContext(RoomContext);
  const [counter, setCounter] = useState(
    getGuessingTime(Object.keys(gameState.inputEntries).length + 1)
  );
  const { selections } = gameState;
  const inGamePlayers = getInGamePlayers(players);

  const definitionsRef = useRef([]);
  const definitionsNumber = getNumberOfDefinitionToDisplay(gameState);
  const showGuessVote = gameSettings?.showGuessVote;

  useEffect(() => {
    definitionsRef.current = definitionsRef.current.slice(0, definitionsNumber);
  }, [definitionsNumber]);

  useEffect(() => {
    if (socket) {
      socket.on('timer', (counter: number) => {
        setCounter(counter);
      });
    }
  });

  const handleSelectDefinition = (selectedUserId: UserId) => {
    setSelectedUserIdDef(selectedUserId);
    socket.emit('select_definition', selectedUserId);
  };

  const minutes = counter && Math.floor(counter / 60);
  const seconds = counter && counter - minutes * 60;
  const usersWhoSelectedDefinition = Object.keys(selections);
  const missingInGamePlayersGuesses = inGamePlayers.filter(
    (player) => !usersWhoSelectedDefinition.includes(player.userId)
  );

  const numberOfRemainingPlayers =
    usersWhoSelectedDefinition.length +
    missingInGamePlayersGuesses.length -
    usersWhoSelectedDefinition.length;

  return (
    <Grid container direction="column" height={1} width={1}>
      <GameHeader />
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Typography variant={'h5'} color={'secondary'}>
          select a definition:
        </Typography>
        <Box display="flex" alignItems={'center'}>
          <AlarmIcon stroke={theme.palette.pink.main} />
          {counter && (
            <Typography
              sx={{
                ml: 1,
              }}
              variant="h4"
              color="secondary"
            >{`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
              2,
              '0'
            )}`}</Typography>
          )}
        </Box>
      </Box>
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
        message={`Submitted! Waiting for ${numberOfRemainingPlayers} other players...`}
        open={selectedUserIdDef}
      />
    </Grid>
  );
};

export default WordGuess;
