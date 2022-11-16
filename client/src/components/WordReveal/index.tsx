import { Grid, Tooltip, Button } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { SocketContext } from '../../App';
import { GameContext, PlayerContext } from '../Room';
import { useParams } from 'react-router-dom';
import { getEntriesWithUsernameToDisplay } from '../DefinitionList/helpers';
import { isRoomAdmin } from '../WaitingRoom/helpers';
import { Box } from '@mui/system';
import { BEFORE_AUTHOR_REVEAL_DELAY, BEFORE_NEXT_DEF_DELAY } from './constants';
import GameHeader from '../GameHeader';
import { bottomPageButtonSx } from '../../constants/style';
import DefinitionList from '../DefinitionList';

const WordReveal = () => {
  const game = useContext(GameContext);
  const players = useContext(PlayerContext);
  const inputEntries = game?.inputEntries;
  const entry = game?.entry;
  const { roomId } = useParams();
  const socket = useContext(SocketContext);
  const isAdmin = isRoomAdmin(players, socket.id);
  const [revealedUsername, setRevealedUsername] = useState<string[]>([]);
  const definitionsRef = useRef([]);

  const inputEntriesToDisplay = getEntriesWithUsernameToDisplay(
    inputEntries,
    entry,
    roomId
  );

  const handleNextStep = () => {
    socket.emit('show_results');
  };

  useEffect(() => {
    definitionsRef.current = definitionsRef.current.slice(
      0,
      inputEntriesToDisplay.length
    );
  }, [inputEntriesToDisplay]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (revealedUsername.length >= inputEntriesToDisplay.length) {
        return () => clearInterval(interval);
      }
      definitionsRef.current?.[revealedUsername.length]?.scrollIntoView({
        behavior: 'smooth',
      });
      setTimeout(
        () =>
          setRevealedUsername((revealedUsername) => [
            ...revealedUsername,
            inputEntriesToDisplay?.[revealedUsername.length]?.[0],
          ]),
        BEFORE_AUTHOR_REVEAL_DELAY
      );
    }, BEFORE_NEXT_DEF_DELAY);
    return () => clearInterval(interval);
  });

  return (
    <Grid container flexDirection="column" height={1} width={1}>
      <GameHeader />
      <DefinitionList
        handleSelectDefinition={() => {}}
        revealedUsername={revealedUsername}
        selectedUsernameDef={null}
        definitionHover={false}
      />
      <Tooltip
        title={isAdmin ? null : 'Waiting for the admin to continue'}
        placement="top"
        sx={{ m: 1 }}
      >
        <Box display="flex" justifyContent={'center'}>
          <Button
            onClick={handleNextStep}
            disabled={
              !isAdmin || revealedUsername.length < inputEntriesToDisplay.length
            }
            variant="contained"
            size="large"
            sx={bottomPageButtonSx}
          >
            Continue
          </Button>
        </Box>
      </Tooltip>
    </Grid>
  );
};

export default WordReveal;
