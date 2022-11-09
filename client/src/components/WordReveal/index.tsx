import { Grid, Tooltip, Button } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../../App';
import { GameContext, PlayerContext } from '../Room';
import { useParams } from 'react-router-dom';
import DefinitionDisplay from '../DefinitionDisplay';
import { getVotingPlayersByDefinitions } from '../WordGuess/helpers';
import VoteBanner from '../VoteBanner';
import { getDefinitionsToDisplay } from '../WordGuess/helpers';
import { isRoomAdmin } from '../WaitingRoom/helpers';
import { Box } from '@mui/system';
import { ANIMATION_TIME_BY_DEF } from './constants';
import { isMobile } from 'react-device-detect';

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

  const handleNextStep = () => {
    socket.emit('show_results');
  };

  const definitionsToDisplay = getDefinitionsToDisplay(
    definitions,
    entry,
    roomId
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (revealedDefPlayers.length === definitionsToDisplay.length) {
        setRevealedDefPlayers([]);
        return;
      }
      setRevealedDefPlayers((revealedDefPlayers) => [
        ...revealedDefPlayers,
        definitionsToDisplay[revealedDefPlayers.length][0],
      ]);
    }, ANIMATION_TIME_BY_DEF);
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
    <Grid container flexDirection="column" height={1}>
      <Box
        display="flex"
        flexDirection="column"
        sx={{ overflowY: 'auto', flex: 1, padding: 1 }}
      >
        {definitionsToDisplay.map(([username, definition]) => (
          <Grid
            container
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
          </Grid>
        ))}
      </Box>
      <Tooltip
        title={isAdmin ? null : 'Waiting for the admin to continue'}
        placement="top"
        sx={{ m: 3 }}
      >
        <Box display="flex" justifyContent={'center'}>
          <Button
            onClick={handleNextStep}
            disabled={!isAdmin}
            variant="contained"
            size="large"
            sx={{ m: 1 }}
          >
            Continue
          </Button>
        </Box>
      </Tooltip>
    </Grid>
  );
};

export default WordReveal;
