import { Grid } from '@mui/material';
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
  const definitionsRef = useRef([]);
  const definitionsNumber = getNumberOfDefinitionToDisplay(game);

  useEffect(() => {
    definitionsRef.current = definitionsRef.current.slice(0, definitionsNumber);
  }, [definitionsNumber]);

  const handleSelectDefinition = (username: string) => {
    setSelectedUsernameDef(username);
    socket.emit('select_definition', { username });
  };

  return (
    <Grid container direction="column" height={1} width={1}>
      <GameHeader />
      <Box sx={{ overflowY: 'auto', flex: 1 }} width={1}>
        <DefinitionList
          handleSelectDefinition={handleSelectDefinition}
          revealedIndexes={[]}
          selectedUsernameDef={selectedUsernameDef}
          definitionHover={true}
          definitionsRef={definitionsRef}
        />
      </Box>
    </Grid>
  );
};

export default WordGuess;
