import { Grid, Tooltip, Button } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { SocketContext } from '../../App';
import { GameContext, PlayerContext } from '../Room';
import { useParams } from 'react-router-dom';
import DefinitionDisplay from '../DefinitionDisplay';
import { getVotingPlayersByDefinitions } from '../WordGuess/helpers';
import VoteBanner from '../VoteBanner';
import { getDefinitionsToDisplay } from '../WordGuess/helpers';
import { isRoomAdmin } from '../WaitingRoom/helpers';
import { Box } from '@mui/system';
import { BEFORE_AUTHOR_REVEAL_DELAY, BEFORE_NEXT_DEF_DELAY } from './constants';
import GameHeader from '../GameHeader';
import { bottomPageButtonSx } from '../../constants/style';

const WordReveal = () => {
  const game = useContext(GameContext);
  const players = useContext(PlayerContext);
  const definitions = game?.definitions;
  const entry = game?.entry;
  const selections = game.selections;
  const { roomId } = useParams();
  const socket = useContext(SocketContext);
  const isAdmin = isRoomAdmin(players, socket.id);
  const [revealedUsername, setRevealedUsername] = useState<string[]>([]);
  const definitionsRef = useRef([]);
  const definitionsToDisplay = getDefinitionsToDisplay(
    definitions,
    entry,
    roomId
  );

  const handleNextStep = () => {
    socket.emit('show_results');
  };

  useEffect(() => {
    definitionsRef.current = definitionsRef.current.slice(
      0,
      definitionsToDisplay.length
    );
  }, [definitionsToDisplay]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (revealedUsername.length >= definitionsToDisplay.length) {
        return () => clearInterval(interval);
      }
      definitionsRef.current?.[revealedUsername.length]?.scrollIntoView({
        behavior: 'smooth',
      });
      setTimeout(
        () =>
          setRevealedUsername((revealedUsername) => [
            ...revealedUsername,
            definitionsToDisplay?.[revealedUsername.length]?.[0],
          ]),
        BEFORE_AUTHOR_REVEAL_DELAY
      );
    }, BEFORE_NEXT_DEF_DELAY);
    return () => clearInterval(interval);
  });

  const votingPlayersByDefinitions = getVotingPlayersByDefinitions(
    players,
    selections
  );

  const extendedPlayers = players.concat({
    username: 'REAL_DEFINITION',
    socketId: 'dictionary',
    color: 'black',
    isAdmin: false,
  });

  return (
    <Grid container flexDirection="column" height={1} width={1}>
      <GameHeader />
      <Box
        display="flex"
        width={1}
        flexDirection="column"
        sx={{ overflowY: 'auto', flex: 1, padding: 0.5 }}
      >
        {definitionsToDisplay.map(([username, definition], index) => (
          <Box
            display="flex"
            flexDirection={'column'}
            key={`definition-${username}`}
            ref={(el) => (definitionsRef.current[index] = el)}
            sx={{
              boxSizing: 'border-box',
              borderRadius: 4,
              padding: 1,
            }}
          >
            <DefinitionDisplay entry={{ ...entry, definition }} />
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
      <Tooltip
        title={isAdmin ? null : 'Waiting for the admin to continue'}
        placement="top"
        sx={{ m: 1 }}
      >
        <Box display="flex" justifyContent={'center'}>
          <Button
            onClick={handleNextStep}
            disabled={
              !isAdmin || revealedUsername.length < definitionsToDisplay.length
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
