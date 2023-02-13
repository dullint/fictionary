import { Grid, Tooltip, Button } from '@mui/material';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { RoomContext } from '../Room';
import { isRoomAdmin } from '../WaitingRoom/helpers';
import { Box } from '@mui/system';
import { BEFORE_AUTHOR_REVEAL_DELAY, BEFORE_NEXT_DEF_DELAY } from './constants';
import GameHeader from '../GameHeader';
import { bottomPageButtonSx } from '../../constants/style';
import DefinitionList from '../DefinitionList';
import { getPlayerIndexGenerator } from './helpers';
import { getNumberOfDefinitionToDisplay } from '../DefinitionList/helpers';
import socket from '../../socket';

const WordReveal = () => {
  const { players, gameState } = useContext(RoomContext);

  const isAdmin = isRoomAdmin(players, socket.id);
  const [revealedAuthorIndexes, setRevealedAuthorIndexes] = useState<number[]>(
    []
  );
  const [revealedBannerIndexes, setRevealedBannerIndexes] = useState<number[]>(
    []
  );
  const definitionsRef = useRef([]);
  const definitionsNumber = getNumberOfDefinitionToDisplay(gameState);
  const allDefinitionsAreRevealed =
    revealedAuthorIndexes?.length >= definitionsNumber;

  useEffect(() => {
    definitionsRef.current = definitionsRef.current.slice(0, definitionsNumber);
  }, [definitionsNumber]);

  const handleNextStep = () => {
    socket.emit('show_results');
  };

  const scrollToDefinitionAndWait = (index: number) => {
    definitionsRef.current?.[index]?.scrollIntoView({
      block: 'center',
      inline: 'nearest',
      behavior: 'smooth',
    });
    setRevealedBannerIndexes((revealedBannerIndexes) => [
      ...revealedBannerIndexes,
      index,
    ]);
    return new Promise<void>((resolve) => {
      return setTimeout(() => {
        resolve();
      }, BEFORE_AUTHOR_REVEAL_DELAY);
    });
  };

  const scrollAndRevealNextDefinition = useCallback(
    async (playerIndexGenerator: Generator, interval: NodeJS.Timer | null) => {
      const result = playerIndexGenerator.next();
      const done = result?.done;
      if (done && !!interval) {
        return () => clearInterval(interval);
      }
      const index = result.value as number;
      await scrollToDefinitionAndWait(index);
      setRevealedAuthorIndexes((revealedAuthorIndexes) => [
        ...revealedAuthorIndexes,
        index,
      ]);
    },
    []
  );

  useEffect(() => {
    const playerIndexGenerator = getPlayerIndexGenerator(
      definitionsNumber ?? 0
    );
    scrollAndRevealNextDefinition(playerIndexGenerator, null);
    const interval = setInterval(async () => {
      scrollAndRevealNextDefinition(playerIndexGenerator, interval);
      return () => clearInterval(interval);
    }, BEFORE_NEXT_DEF_DELAY + BEFORE_AUTHOR_REVEAL_DELAY);
  }, [definitionsNumber, scrollAndRevealNextDefinition]);

  return (
    <Grid container flexDirection="column" height={1} width={1}>
      <GameHeader />
      <Box
        sx={{
          overflowY: 'auto',
          overflowX: 'hidden',
          flex: 1,
        }}
        width={1}
      >
        <DefinitionList
          showVoteBanner={true}
          handleSelectDefinition={() => {}}
          revealedAuthorIndexes={revealedAuthorIndexes}
          revealedBannerIndexes={revealedBannerIndexes}
          selectedUsernameDef={null}
          definitionHover={false}
          definitionsRef={definitionsRef}
        />
      </Box>
      <Tooltip
        title={isAdmin ? null : 'Waiting for the admin to continue'}
        placement="top"
        sx={{ m: 1 }}
      >
        <Box display="flex" justifyContent={'center'}>
          <Button
            onClick={handleNextStep}
            disabled={!isAdmin || !allDefinitionsAreRevealed}
            variant="contained"
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
