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
import { getPlayerIndexGenerator } from './helpers';
import { getNumberOfDefinitionToDisplay } from '../DefinitionList/helpers';

const WordReveal = () => {
  const game = useContext(GameContext);
  const players = useContext(PlayerContext);
  const socket = useContext(SocketContext);
  const isAdmin = isRoomAdmin(players, socket.id);
  const [revealedIndexes, setRevealedIndexes] = useState<number[]>([]);
  const definitionsRef = useRef([]);
  const definitionsNumber = getNumberOfDefinitionToDisplay(game);

  useEffect(() => {
    definitionsRef.current = definitionsRef.current.slice(0, definitionsNumber);
  }, [definitionsNumber]);

  const handleNextStep = () => {
    socket.emit('show_results');
  };

  const scrollToDefinitionAndWait = async (index: number) => {
    return await new Promise<void>((resolve) => {
      return setTimeout(() => {
        definitionsRef.current?.[index]?.scrollIntoView({
          behavior: 'smooth',
        });
        resolve();
      }, BEFORE_AUTHOR_REVEAL_DELAY);
    });
  };

  useEffect(() => {
    const playerIndexGenerator = getPlayerIndexGenerator(
      definitionsNumber ?? 0
    );
    const interval = setInterval(() => {
      const result = playerIndexGenerator.next();
      const done = result?.done;
      if (done) {
        return () => clearInterval(interval);
      }
      const index = result.value as number;
      console.log('scrolling to element', index);
      scrollToDefinitionAndWait(index);
      console.log('revealing element', index);
      setRevealedIndexes((revealedIndexes) => [...revealedIndexes, index]);
      return () => clearInterval(interval);
    }, BEFORE_NEXT_DEF_DELAY + 1000);
  }, [definitionsNumber]);

  return (
    <Grid container flexDirection="column" height={1} width={1}>
      <GameHeader />
      <DefinitionList
        handleSelectDefinition={() => {}}
        revealedIndexes={revealedIndexes}
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
            disabled={!isAdmin || revealedIndexes.length < definitionsNumber}
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
