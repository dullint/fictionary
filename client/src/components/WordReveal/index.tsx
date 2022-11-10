import { Grid, Tooltip, Button } from '@mui/material';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
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
  const [numberRevealedDef, setNumberRevealedDef] = useState(0);
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
      console.log(revealedUsername);
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
              !isAdmin ||
              revealedUsername.length !== definitionsToDisplay.length
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