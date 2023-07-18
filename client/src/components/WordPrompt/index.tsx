import {
  Box,
  Button,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { RoomContext } from '../Room';
import {
  DEFINITION_CHARACTER_LIMIT,
  EXAMPLE_CHARACTER_LIMIT,
} from './constants';
import { theme } from '../../theme';
import GameHeader from '../GameHeader';
import DefinitionRender from '../DefinitionRender';
import { cleanSentence } from './helpers';
import socket from '../../socket';
import { getInGamePlayers } from '../Room/helpers';
import { getMyPlayer } from '../WaitingRoom/helpers';
import writtingImg from '../../img/writting.png';
import { ReactComponent as AlarmIcon } from '../../img/alarm.svg';

const WordPrompt = () => {
  const { gameState, gameSettings, players } = useContext(RoomContext);
  const { entry, inputEntries } = gameState;
  const inGamePlayers = getInGamePlayers(players);
  const isAdmin = getMyPlayer(players)?.isAdmin;

  const wordRef = useRef(null);
  const ExRef = useRef(null);
  const [wordWidth, setWordWidth] = useState(0);
  const [ExWidth, setExWidth] = useState(0);
  const [definition, setDefinition] = useState('');
  const [example, setExample] = useState('');
  const [hasSubmited, setHasSubmited] = useState(false);
  const [counter, setCounter] = useState(gameSettings.maxPromptTime * 60);
  const isUsingExample = gameSettings.useExample;

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
      definition: cleanSentence(definition),
      example: cleanSentence(example),
      autosave: false,
    });
  };

  const handleModify = () => {
    setHasSubmited(false);
    socket.emit('remove_definition');
  };

  useEffect(() => {
    if (socket) {
      socket.on('timer', (counter: number) => {
        setCounter(counter);
        if (counter === 1) {
          socket.emit('submit_definition', {
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

  const usersWhoSubmittedDefinition = Object.entries(inputEntries).reduce(
    (acc, [userId, entry]) => {
      if (!entry?.autosave) acc.push(userId);
      return acc;
    },
    [] as string[]
  );
  const missingInGamePlayersDefinitions = inGamePlayers.filter(
    (player) => !usersWhoSubmittedDefinition.includes(player.userId)
  );

  const minutes = counter && Math.floor(counter / 60);
  const seconds = counter && counter - minutes * 60;
  return (
    <Grid
      container
      height={1}
      width={1}
      justifyContent={'center'}
      flexDirection={'column'}
    >
      <GameHeader>
        <Box display="flex" flexDirection={'row'}>
          <Typography variant="h6">
            {`${usersWhoSubmittedDefinition.length} / ${
              usersWhoSubmittedDefinition.length +
              missingInGamePlayersDefinitions.length
            }`}
          </Typography>
          <Typography
            variant="h6"
            display={{ xs: 'none', sm: 'block' }}
            sx={{ textIndent: 10 }}
          >
            players
          </Typography>
        </Box>
      </GameHeader>
      <Box
        display="flex"
        sx={{ overflowY: 'auto', flex: 1 }}
        alignItems={'center'}
        flexDirection="column"
      >
        <Box
          display={'flex'}
          alignItems={'center'}
          flexDirection={'column'}
          sx={{ marginBottom: 3 }}
        >
          <Box
            component={'img'}
            src={writtingImg}
            alt={'pen'}
            sx={{ width: { xs: '100px', sm: 'auto' } }}
          />
          <Typography variant="subtitle1">Invent your definition</Typography>
          <Box display="flex" alignItems={'center'}>
            <AlarmIcon stroke={theme.palette.pink.main} />
            {counter && (
              <Typography
                sx={{
                  ml: 1,
                }}
                variant="h4"
                color="secondary"
              >{`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
                2,
                '0'
              )}`}</Typography>
            )}
          </Box>
          {isAdmin && (
            <Button
              variant="outlined"
              onClick={handleKnowWord}
              size="small"
              sx={{ mt: 2 }}
            >
              Change word
            </Button>
          )}
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          width={1}
          sx={{ position: 'relative', maxWidth: 500 }}
        >
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
        </Box>
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
          <Button
            onClick={() => (hasSubmited ? handleModify() : handleSubmit())}
            variant={hasSubmited ? 'outlined' : 'contained'}
            sx={{ width: 200 }}
          >
            {hasSubmited ? 'Modify' : 'Submit'}
          </Button>
        </Box>
        <Snackbar
          open={hasSubmited}
          message={'Submitted! Waiting for other players...'}
        />
      </Box>
    </Grid>
  );
};

export default WordPrompt;
