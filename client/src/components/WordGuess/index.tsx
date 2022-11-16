import { Grid } from '@mui/material';
import React, { useContext, useState } from 'react';
import { SocketContext } from '../../App';
import GameHeader from '../GameHeader';
import DefinitionList from '../DefinitionList';

const WordGuess = () => {
  const [selectedUsernameDef, setSelectedUsernameDef] = useState(null);
  const socket = useContext(SocketContext);

  const handleSelectDefinition = (username: string) => {
    setSelectedUsernameDef(username);
    socket.emit('select_definition', { username });
  };

  return (
    <Grid container direction="column" height={1} width={1}>
      <GameHeader />
      <DefinitionList
        handleSelectDefinition={handleSelectDefinition}
        revealedUsername={[]}
        selectedUsernameDef={selectedUsernameDef}
        definitionHover={true}
      />
    </Grid>
  );
};

export default WordGuess;
