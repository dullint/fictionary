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
import { isMobile } from 'react-device-detect';
import { delay } from './helpers';
// import { delay } from './helpers';

const WordReveal = () => {
  const game = useContext(GameContext);
  const players = useContext(PlayerContext);
  const definitions = game?.definitions;
  const entry = game?.entry;
  const selections = game.selections;
  const { roomId } = useParams();
  const socket = useContext(SocketContext);
  const isAdmin = isRoomAdmin(players, socket.id);
  const [revealedDefPlayers, setRevealedDefPlayers] = useState<string[]>([]);
  const definitionsRef = useRef([]);

  const handleNextStep = () => {
    socket.emit('show_results');
  };

  const definitionsToDisplay = getDefinitionsToDisplay(
    definitions,
    entry,
    roomId
  );

  useEffect(() => {
    definitionsRef.current = definitionsRef.current.slice(
      0,
      definitionsToDisplay.length
    );
  }, [definitionsToDisplay]);

  useEffect(() => {
    definitionsRef.current?.[revealedDefPlayers?.length]?.scrollIntoView({
      behavior: 'smooth',
    });
    const interval = setInterval(() => {
      if (revealedDefPlayers.length === definitionsToDisplay.length) {
        return;
      }
      definitionsRef.current?.[revealedDefPlayers?.length]?.scrollIntoView({
        behavior: 'smooth',
      });
      setTimeout(() => {}, BEFORE_AUTHOR_REVEAL_DELAY);
      setRevealedDefPlayers((revealedDefPlayers) => [
        ...revealedDefPlayers,
        definitionsToDisplay[revealedDefPlayers.length][0],
      ]);
    }, BEFORE_NEXT_DEF_DELAY);
    return () => clearInterval(interval);
  }, [definitionsToDisplay, revealedDefPlayers.length]);

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
      <Box
        display="flex"
        width={1}
        flexDirection="column"
        sx={{ overflowY: 'auto', flex: 1, padding: 1 }}
      >
        {definitionsToDisplay.map(([username, definition], index) => (
          <Box
            display="flex"
            flexDirection={'column'}
            key={`definition-${username}`}
            ref={(el) => (definitionsRef.current[index] = el)}
            sx={{
              boxSizing: 'border-box',
              borderRadius: 2,
              padding: 1,
            }}
          >
            <DefinitionDisplay
              word={entry.word}
              definition={definition}
              type={entry.type}
            />
            <VoteBanner
              votingPlayers={votingPlayersByDefinitions[username] ?? []}
              authorPlayer={extendedPlayers.find(
                (player) => player.username === username
              )}
              size={isMobile ? 'small' : 'big'}
              revealed={revealedDefPlayers.includes(username)}
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
              !isAdmin ||
              revealedDefPlayers.length !== definitionsToDisplay.length
            }
            variant="contained"
            size="large"
          >
            Continue
          </Button>
        </Box>
      </Tooltip>
    </Grid>
  );
};

export default WordReveal;
