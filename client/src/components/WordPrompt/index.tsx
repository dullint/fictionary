import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import FindReplaceIcon from '@mui/icons-material/FindReplace';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../../App';
import DefinitionDisplay from '../DefinitionDisplay';
import { GameContext } from '../Room';
import { CHARACTER_LIMIT } from './constants';

const WordPrompt = () => {
  const game = useContext(GameContext);
  const entryRef = useRef(null);
  const [entryWidth, setEntryWidth] = useState(0);
  const socket = useContext(SocketContext);
  const [definition, setDefinition] = useState('');
  const [hasSubmited, setHasSubmited] = useState(false);
  const [counter, setCounter] = useState(game.gameSettings.maxPromptTime * 60);
  const { roomId } = useParams();
  const entry = game?.entry;

  useEffect(() => {
    setEntryWidth(entryRef.current.clientWidth);
  }, [entryRef]);
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
  return (
    <Grid container direction="column">
      <Grid container justifyContent={'space-between'} flexDirection="row">
        <Typography variant="subtitle1" sx={{ m: 2 }}>
          Time to write your definition!
        </Typography>
        <Button
          onClick={handleKnowWord}
          endIcon={<FindReplaceIcon />}
          size="small"
        >
          I know this word
        </Button>
      </Grid>
      {entry && (
        <Grid container direction="column">
          <Box zIndex={2} position="absolute" ref={entryRef} sx={{ m: 2 }}>
            <DefinitionDisplay
              word={entry.word}
              type={entry.type}
              definition={''}
            ></DefinitionDisplay>
          </Box>
          <TextField
            autoFocus
            disabled={hasSubmited}
            value={definition}
            multiline
            fullWidth
            helperText={`${definition.length}/${CHARACTER_LIMIT}`}
            rows={6}
            onChange={handleTextFieldChange}
            inputProps={{
              maxLength: CHARACTER_LIMIT,
              lineHeight: '22px',
            }}
            sx={{
              marginTop: 0,
              marginBottom: '14px',
              '& .MuiOutlinedInput-input': {
                lineHeight: '22px',
                textIndent: entryWidth,
              },
            }}
          />
          <Grid container direction="row" justifyContent="start">
            {hasSubmited ? (
              <Button onClick={handleModify} variant="contained">
                Modify
              </Button>
            ) : (
              <Button onClick={handleSubmit} variant="contained">
                Submit
              </Button>
            )}
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
