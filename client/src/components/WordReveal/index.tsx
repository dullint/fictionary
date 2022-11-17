import { Grid, Tooltip, Button } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { SocketContext } from '../../App';
import { GameContext, PlayerContext } from '../Room';
import { isRoomAdmin } from '../WaitingRoom/helpers';
import { Box } from '@mui/system';
import { BEFORE_AUTHOR_REVEAL_DELAY, BEFORE_NEXT_DEF_DELAY } from './constants';
import GameHeader from '../GameHeader';
import { bottomPageButtonSx } from '../../constants/style';
import DefinitionList from '../DefinitionList';
import { useParams } from 'react-router-dom';
import {
  getEntriesWithUsernameToDisplay,
  getNumberOfDefinitionToDisplay,
} from '../DefinitionList/helpers';

const WordReveal = () => {
  const game = useContext(GameContext);
  const players = useContext(PlayerContext);
  const socket = useContext(SocketContext);
  const inputEntries = game?.inputEntries;
  const entry = game?.entry;
  const { roomId } = useParams();
  const isAdmin = isRoomAdmin(players, socket.id);
  const [revealedUsernames, setRevealedUsernames] = useState<string[]>([]);
  const definitionsRef = useRef([]);
  const definitionsNumber = getNumberOfDefinitionToDisplay(game);

  const inputEntriesToDisplay = getEntriesWithUsernameToDisplay(
    inputEntries,
    entry,
    roomId
  );

  useEffect(() => {
    definitionsRef.current = definitionsRef.current.slice(0, definitionsNumber);
  }, [definitionsNumber]);

  const handleNextStep = () => {
    socket.emit('show_results');
  };

  useEffect(() => {
    definitionsRef.current = definitionsRef.current.slice(0, definitionsNumber);
  }, [definitionsNumber]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (revealedUsernames.length >= definitionsNumber) {
        return () => clearInterval(interval);
      }
      definitionsRef.current?.[revealedUsernames.length]?.scrollIntoView({
        behavior: 'smooth',
      });
      setTimeout(
        () =>
          setRevealedUsernames((revealedUsernames) => [
            ...revealedUsernames,
            inputEntriesToDisplay?.[revealedUsernames.length]?.[0],
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
        revealedUsernames={revealedUsernames}
        selectedUsernameDef={null}
        definitionHover={false}
        definitionsRef={definitionsRef}
      />
      <Tooltip
        title={isAdmin ? null : 'Waiting for the admin to continue'}
        placement="top"
        sx={{ m: 1 }}
      >
        <Box display="flex" justifyContent={'center'}>
          <Button
            onClick={handleNextStep}
            disabled={!isAdmin || revealedUsernames.length < definitionsNumber}
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
