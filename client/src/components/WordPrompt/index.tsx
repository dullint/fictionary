import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import FindReplaceIcon from '@mui/icons-material/FindReplace';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../../App';
import DefinitionDisplay from '../DefinitionDisplay';
import { GameContext } from '../Room';
import { CHARACTER_LIMIT } from './constants';
import { isMobile } from 'react-device-detect';
import { theme } from '../../theme';
import GameHeader from '../GameHeader';
import { BOTTOM_MAIN_BUTTON_WIDTH } from '../Room/constants';

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

  const handlePressKey = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (game?.entry) {
      setDefinition('');
    }
  }, [game?.entry]);

  const minutes = counter && Math.floor(counter / 60);
  const seconds = counter && counter - minutes * 60;
  return (
    <Grid
      container
      alignItems="center"
      // justifyContent="center"
      direction="column"
    >
      <GameHeader />
      <Grid
        container
        justifyContent={'space-between'}
        flexDirection="row"
        alignItems={'center'}
      >
        {counter && (
          <Typography sx={{ m: 1 }} variant="h4" color="secondary">{`${String(
            minutes
          ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}</Typography>
        )}
        <Tooltip title="I know this word" arrow>
          <IconButton
            onClick={handleKnowWord}
            sx={{
              border: `2px solid ${theme.palette.primary.main}`,
              width: 40,
              height: 40,
              borderRadius: 4,
              color: theme.palette.primary.main,
            }}
          >
            <FindReplaceIcon />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid container direction="column">
        <Box zIndex={2} position="absolute" ref={entryRef} sx={{ m: 2 }}>
          <DefinitionDisplay
            entry={{ ...entry, definition: '' }}
          ></DefinitionDisplay>
        </Box>
        <TextField
          autoFocus
          disabled={hasSubmited}
          onKeyPress={handlePressKey}
          value={definition}
          multiline
          rows={isMobile ? 10 : 6}
          fullWidth
          helperText={`${definition.length}/${CHARACTER_LIMIT}`}
          onChange={handleTextFieldChange}
          inputProps={{
            maxLength: CHARACTER_LIMIT,
            lineHeight: '22px',
          }}
          sx={{
            marginTop: 0.5,
            marginBottom: '14px',
            '& .MuiOutlinedInput-input': {
              lineHeight: '22px',
              textIndent: entryWidth,
            },
          }}
        />
      </Grid>
      <Button
        onClick={() => (hasSubmited ? handleModify() : handleSubmit())}
        variant="contained"
        sx={{ width: BOTTOM_MAIN_BUTTON_WIDTH }}
      >
        {hasSubmited ? 'Modify' : 'Submit'}
      </Button>
      <Grid container direction="row" justifyContent="space-between">
        <Typography display="flex" alignItems={'center'} variant="body1">
          {hasSubmited
            ? 'Waiting for other player to submit their definition!'
            : null}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default WordPrompt;
