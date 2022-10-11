import { Button, Grid, TextField, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../../App';
import { GameContext } from '../Room';

const WordPrompt = () => {
  const game = useContext(GameContext);
  const socket = useContext(SocketContext);
  const [definition, setDefinition] = useState('');
  const [hasSubmited, setHasSubmited] = useState(false);
  const { roomId } = useParams();
  const entry = game?.entry;

  const handleKnowWord = () => {
    socket.emit('get_new_word', { roomId });
  };
  const handleTextFieldChange = (event) => {
    setDefinition(event.target.value);
  };
  const handleSubmit = () => {
    if (definition) {
      setHasSubmited(true);
      socket.emit('submit_definition', { roomId, definition });
    }
  };
  const handleModify = () => {
    setHasSubmited(false);
    socket.emit('remove_definition', { roomId, word: entry.word });
  };

  return (
    <Grid container direction="column">
      <Typography variant="subtitle1" sx={{ m: 2 }}>
        Time to write your definition!
      </Typography>
      {entry && (
        <Grid>
          <Typography
            variant="h4"
            sx={{ fontStyle: 'italic', textTransform: 'uppercase' }}
          >
            {entry.word}
          </Typography>
          {hasSubmited ? (
            <p>{definition}</p>
          ) : (
            <TextField
              autoFocus
              value={definition}
              label="Definition"
              multiline
              fullWidth
              rows={4}
              onChange={handleTextFieldChange}
              sx={{ backgroundColor: 'white', marginTop: 2, marginBottom: 2 }}
            />
          )}
          <Grid>
            <Grid>
              {hasSubmited ? (
                <Button onClick={handleModify} variant="contained">
                  Modify
                </Button>
              ) : (
                <Button onClick={handleSubmit} variant="contained">
                  Submit
                </Button>
              )}
              <Button onClick={handleKnowWord}>I already know this word</Button>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default WordPrompt;
