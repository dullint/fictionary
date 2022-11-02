import { Button, Grid, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../../App';
import { GameContext } from '../Room';
import { CHARACTER_LIMIT } from './constants';

const WordPrompt = () => {
  const game = useContext(GameContext);
  const socket = useContext(SocketContext);
  const [definition, setDefinition] = useState('');
  const [hasSubmited, setHasSubmited] = useState(false);
  const [counter, setCounter] = useState(game.gameSettings.maxPromptTime * 60);
  const { roomId } = useParams();
  const entry = game?.entry;

  const handleKnowWord = () => {
    socket.emit('get_new_word');
  };
  const handleTextFieldChange = (event) => {
    if (hasSubmited) return;
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

  useEffect(() => {
    if (socket) {
      socket.on('timer', (counter: number) => setCounter(counter));
    }
  });

  useEffect(() => {
    if (game?.entry) {
      setDefinition('');
    }
  }, [game?.entry]);

  const minutes = counter && Math.floor(counter / 60);
  const seconds = counter && counter - minutes * 60;
  console.log(entry);

  return (
    <Grid container direction="column">
      <Typography variant="subtitle1" sx={{ m: 2 }}>
        Time to write your definition!
      </Typography>
      {entry && (
        <Grid container direction="column">
          <Grid container direction="row" alignItems={'center'}>
            <Typography
              variant="h4"
              sx={{
                fontStyle: 'italic',
                marginRight: 1,
                marginLeft: 2,
              }}
            >
              {entry.word}
            </Typography>
            <Typography variant="button">· {entry.type}</Typography>
          </Grid>
          {hasSubmited ? (
            <Typography
              sx={{
                marginTop: '16.5px',
                marginBottom: '30.5px',
                marginLeft: '14px',
                marginRight: '14px',
                height: '132px',
                textOverflow: 'ellipsis',
              }}
            >
              {definition}
            </Typography>
          ) : (
            <TextField
              autoFocus
              value={definition}
              multiline
              fullWidth
              helperText={`${definition.length}/${CHARACTER_LIMIT}`}
              rows={6}
              onChange={handleTextFieldChange}
              inputProps={{ maxLength: CHARACTER_LIMIT, lineHeight: '22px' }}
              sx={{
                marginTop: 0,
                marginBottom: '14px',
                '& .MuiOutlinedInput-input': {
                  lineHeight: '22px',
                },
              }}
            />
          )}
          <Grid container direction="row" justifyContent="space-between">
            {hasSubmited ? (
              <Button onClick={handleModify} variant="contained">
                Modify
              </Button>
            ) : (
              <Button onClick={handleSubmit} variant="contained">
                Submit
              </Button>
            )}
            <Button onClick={handleKnowWord}>I know this word</Button>
          </Grid>
        </Grid>
      )}
      <Grid container direction="row" justifyContent="space-between">
        <Typography display="flex" alignItems={'center'} variant="body1">
          {hasSubmited
            ? 'Waiting for other player to submit their definition!'
            : null}
        </Typography>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{
            borderRadius: 100,
            height: 70,
            width: 70,
            backgroundColor: 'green',
          }}
        >
          {counter && (
            <Typography sx={{ color: 'white' }} variant="h6">{`${String(
              minutes
            ).padStart(2, '0')}:${String(seconds).padStart(
              2,
              '0'
            )}`}</Typography>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default WordPrompt;
