import {
  CardActionArea,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import { SocketContext } from '../../App';
import { GameContext } from '../Room';
import { shuffle } from 'shuffle-seed';
import { useParams } from 'react-router-dom';

const WordGuess = () => {
  const game = useContext(GameContext);
  const definitions = game?.definitions;
  const entry = game?.entry;
  const realDefinition = entry?.definition;
  const [selectedSocketDef, setSelectedSocketDef] = useState(null);
  const { roomId } = useParams();
  const socket = useContext(SocketContext);

  const handleSelectDefinition = (socketId) => {
    setSelectedSocketDef(socketId);
    socket.emit('select_definition', { socketId });
  };
  const definitionToDisplay = Object.entries(definitions)
    .concat([['REAL_DEFINITION', realDefinition]])
    .filter(([socketId, _]) => socketId !== socket?.id);
  const seed = `${entry.word}-${roomId}`;
  const suffledDefinitions = shuffle(definitionToDisplay, seed);
  return (
    <div>
      <h1>WordGuess</h1>
      <Grid container>
        {suffledDefinitions.map(([socketId, definition]) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            // sx={{ border: '1px solid red', borderColor: 'red' }}
          >
            <CardActionArea
              sx={{
                minWidth: 100,
                border: socketId === selectedSocketDef ? '1px solid red' : '',
                // borderColor: 'red',
              }}
              onClick={() => handleSelectDefinition(socketId)}
            >
              <CardContent>
                <Typography variant="h5">{entry.word}</Typography>
                <Typography variant="body2">{definition}</Typography>
              </CardContent>
            </CardActionArea>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default WordGuess;
