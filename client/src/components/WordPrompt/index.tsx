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
import { GameContext } from '../Room';
import {
  DEFINITION_CHARACTER_LIMIT,
  EXAMPLE_CHARACTER_LIMIT,
} from './constants';
import { theme } from '../../theme';
import GameHeader from '../GameHeader';
import { bottomPageButtonSx } from '../../constants/style';
import DefinitionRender from '../DefinitionRender';
import { cleanSentence } from './helpers';

const WordPrompt = () => {
  const game = useContext(GameContext);
  const players = game.players.getInGamePlayers();
  const wordRef = useRef(null);
  const ExRef = useRef(null);
  const [wordWidth, setWordWidth] = useState(0);
  const [ExWidth, setExWidth] = useState(0);
  const socket = useContext(SocketContext);
  const [definition, setDefinition] = useState('');
  const [example, setExample] = useState('');
  const [hasSubmited, setHasSubmited] = useState(false);
  const [counter, setCounter] = useState(game.gameSettings.maxPromptTime * 60);
  const { roomId } = useParams();
  const entry = game?.entry;
  const isUsingExample = game.gameSettings.useExample ?? false;

  useEffect(() => {
    setWordWidth(wordRef?.current?.clientWidth);
  }, [wordRef, entry]);

  useEffect(() => {
    setExWidth(ExRef?.current?.clientWidth);
  }, [ExRef, entry]);

  useEffect(() => {
    setHasSubmited(false);
    setDefinition('');
    setExample('');
  }, [entry.word]);

  const handleKnowWord = () => {
    socket.emit('get_new_word');
  };

  const handleDefinitionChange = (event) => {
    if (hasSubmited) return;
    setDefinition(event.target.value);
  };

  const handleExampleChange = (event) => {
    if (hasSubmited) return;
    setExample(event.target.value);
  };

  const handleSubmit = () => {
    if (!definition || (isUsingExample && !example)) return;
    setDefinition(cleanSentence(definition));
    setExample(cleanSentence(example));
    setHasSubmited(true);
    socket.emit('submit_definition', {
      roomId,
      definition: cleanSentence(definition),
      example: cleanSentence(example),
      autosave: false,
    });
  };

  const handleModify = () => {
    setHasSubmited(false);
    socket.emit('remove_definition', { roomId, word: entry.word });
  };

  useEffect(() => {
    if (socket) {
      socket.on('timer', (counter: number) => {
        setCounter(counter);
        if (counter === 1) {
          socket.emit('submit_definition', {
            roomId,
            definition: cleanSentence(definition),
            example: cleanSentence(example),
            autosave: true,
          });
        }
      });
    }
  });

  const handlePressKey = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  };

  const numberOfSubmittedDefinition = Object.values(
    game?.inputEntries ?? {}
  ).filter((entry) => !entry.autosave).length;

  const minutes = counter && Math.floor(counter / 60);
  const seconds = counter && counter - minutes * 60;
  return (
    <Grid container alignItems="center" direction="column" height={1} width={1}>
      <Grid item width={1}>
        <GameHeader>
          <Box display="flex" flexDirection={'row'}>
            <Typography variant="h6">
              {`${numberOfSubmittedDefinition} / ${players.length}`}
            </Typography>
            <Typography
              variant="h6"
              display={{ xs: 'none', sm: 'block' }}
              sx={{ textIndent: 10 }}
            >
              definitions
            </Typography>
          </Box>
        </GameHeader>
      </Grid>
      <Grid item width={1}>
        <Grid
          container
          justifyContent={'space-between'}
          direction="row"
          alignItems={'center'}
        >
          {counter && (
            <Typography sx={{ m: 1 }} variant="h4" color="secondary">{`${String(
              minutes
            ).padStart(2, '0')}:${String(seconds).padStart(
              2,
              '0'
            )}`}</Typography>
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
      </Grid>
      <Grid container sx={{ overflowY: 'auto', flex: 1, position: 'relative' }}>
        <Grid item width={1}>
          <Grid container direction="column" flex={1}>
            <Box
              zIndex={2}
              position="absolute"
              ref={wordRef}
              sx={{ m: 2.25, marginLeft: 2 }}
            >
              <DefinitionRender
                entry={{ ...entry, definition: '', example: '' }}
              ></DefinitionRender>
            </Box>
            <TextField
              autoFocus
              disabled={hasSubmited}
              onKeyPress={handlePressKey}
              value={definition}
              multiline
              minRows={2}
              fullWidth
              helperText={`${definition.length}/${DEFINITION_CHARACTER_LIMIT}`}
              onChange={handleDefinitionChange}
              inputProps={{
                maxLength: DEFINITION_CHARACTER_LIMIT,
                lineheight: '22px',
              }}
              sx={{
                marginTop: 0.5,
                marginBottom: '14px',
                '& .MuiOutlinedInput-input': {
                  lineheight: '22px',
                  textIndent: wordWidth + 1,
                },
              }}
            />
            {isUsingExample && (
              <Box>
                <Box
                  zIndex={2}
                  position="absolute"
                  ref={ExRef}
                  sx={{ m: 2.25, marginLeft: 2 }}
                >
                  <Typography
                    component="span"
                    fontFamily="bespoke-medium"
                    sx={{ marginRight: 0.5 }}
                    fontSize={17}
                  >
                    Ex.
                  </Typography>
                </Box>
                <TextField
                  disabled={hasSubmited}
                  onKeyPress={handlePressKey}
                  value={example}
                  multiline
                  minRows={2}
                  fullWidth
                  helperText={`${example.length}/${EXAMPLE_CHARACTER_LIMIT}`}
                  onChange={handleExampleChange}
                  inputProps={{
                    maxLength: EXAMPLE_CHARACTER_LIMIT,
                    lineheight: '22px',
                  }}
                  sx={{
                    marginTop: 0.5,
                    marginBottom: '14px',
                    '& .MuiOutlinedInput-input': {
                      lineheight: '22px',
                      textIndent: ExWidth + 1,
                    },
                  }}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Button
          onClick={() => (hasSubmited ? handleModify() : handleSubmit())}
          variant="contained"
          sx={bottomPageButtonSx}
        >
          {hasSubmited ? 'Modify' : 'Submit'}
        </Button>
      </Grid>
    </Grid>
  );
};

export default WordPrompt;
