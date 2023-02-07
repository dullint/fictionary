import { Grid, Typography } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { SocketContext } from '../../App';
import GameHeader from '../GameHeader';
import DefinitionList from '../DefinitionList';
import { getNumberOfDefinitionToDisplay } from '../DefinitionList/helpers';
import { GameContext } from '../Room';
import { Box } from '@mui/system';

const WordGuess = () => {
  const [selectedUsernameDef, setSelectedUsernameDef] = useState(null);
  const socket = useContext(SocketContext);
  const game = useContext(GameContext);
  const gamePlayers = game.gamePlayers;
  const definitionsRef = useRef([]);
  const definitionsNumber = getNumberOfDefinitionToDisplay(game);
  const showGuessVote = game?.gameSettings?.showGuessVote;
  const numberOfGuess = Object.values(game?.selectDefinition ?? {}).length;

  useEffect(() => {
    definitionsRef.current = definitionsRef.current.slice(0, definitionsNumber);
  }, [definitionsNumber]);

  const handleSelectDefinition = (username: string) => {
    setSelectedUsernameDef(username);
    socket.emit('select_definition', { username });
  };

  return (
    <Grid container direction="column" height={1} width={1}>
      <GameHeader>
        <Box display="flex" flexDirection={'row'}>
          <Typography variant="h6">
            {`${numberOfGuess} / ${gamePlayers.length}`}
          </Typography>
          <Typography
            variant="h6"
            display={{ xs: 'none', sm: 'block' }}
            sx={{ textIndent: 10 }}
          >
            guesses
          </Typography>
        </Box>
      </GameHeader>
      <Box sx={{ overflowY: 'auto', flex: 1 }} width={1}>
        <DefinitionList
          showVoteBanner={showGuessVote}
          handleSelectDefinition={handleSelectDefinition}
          revealedAuthorIndexes={[]}
          selectedUsernameDef={selectedUsernameDef}
          definitionHover={true}
          definitionsRef={definitionsRef}
          revealedBannerIndexes={[]}
        />
      </Box>
    </Grid>
  );
};

export default WordGuess;
