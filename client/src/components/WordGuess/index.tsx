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
      <Typography variant="subtitle1" sx={{ m: 2 }}>
        Guess the Right Word!
      </Typography>
      <Grid container>
        {suffledDefinitions.map(([socketId, definition]) => (
          <Grid item xs={12} sm={6}>
            <CardActionArea
              sx={{
                height: 270,
                width: 270,
                border: socketId === selectedSocketDef ? '1px solid red' : '',
                backgroundColor: 'white',
                m: 1,
                display: 'flex',
                alignItems: 'start',
                justifyContent: 'start',
                borderRadius: 3,
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
        <Typography variant="body1" sx={{ m: 1 }}>
          {selectedSocketDef
            ? 'Waiting for other players to pick a definition'
            : null}
        </Typography>
      </Grid>
    </div>
  );
};

export default WordGuess;
