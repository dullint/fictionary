import React, { useEffect, useContext, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  promptTimeOptions,
  roundNumberOptions,
  useExampleOptions,
} from './constants';
import { RoomContext } from '../Room';
import { GameSettings } from '../../../../server/src/room/types';
import socket from '../../socket';
import { theme } from '../../theme';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export enum DictionaryLanguage {
  French = 'french',
  English = 'english',
}
export interface PropsType {
  isAdmin: boolean;
}

const GameSettingsDisplayer = (props: PropsType) => {
  const { isAdmin } = props;
  const { gameSettings } = useContext(RoomContext);
  const [maxPromptTime, setMaxPromptTime] = useState(
    gameSettings.maxPromptTime
  );
  const [useExample, setUseExample] = useState(gameSettings.useExample);
  const [roundNumber, setRoundNumber] = useState(gameSettings.roundNumber);

  useEffect(() => {
    const newGameSettings: GameSettings = {
      maxPromptTime,
      roundNumber,
      useExample,
      showGuessVote: false,
      language: DictionaryLanguage.French,
    };
    socket.emit('change_game_settings', newGameSettings);
  }, [maxPromptTime, roundNumber, useExample]);

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundColor: theme.palette.yellow.darker,
        borderRadius: 5,
        paddingTop: 1.5,
        paddingBottom: 1.5,
        paddingLeft: { xs: '10%', sm: '30%' },
        paddingRight: { xs: '10%', sm: '30%' },
        overflowY: 'auto',
      }}
    >
      <Typography variant={'h6'}>Settings</Typography>
      <Typography variant={'body1'} sx={{ m: 1 }}>
        Number of rounds:
      </Typography>
      <ButtonGroup
        variant="outlined"
        disabled={!isAdmin}
        size="small"
        fullWidth
      >
        {roundNumberOptions.map((value) => {
          return (
            <Button
              onClick={() => {
                setRoundNumber(value);
              }}
              variant={value === roundNumber ? 'contained' : 'outlined'}
              key={`roundNumberOptions-${value}`}
              color={'black'}
            >
              {value}
            </Button>
          );
        })}
      </ButtonGroup>
      <Typography variant="body1" sx={{ marginTop: 2, marginBottom: 1 }}>
        Max writing time (Min):
      </Typography>
      <ButtonGroup
        variant="outlined"
        disabled={!isAdmin}
        size="small"
        fullWidth
      >
        {promptTimeOptions.map((value) => {
          return (
            <Button
              key={`promptTimeOptions-${value}`}
              onClick={() => {
                setMaxPromptTime(value);
              }}
              variant={value === maxPromptTime ? 'contained' : 'outlined'}
              color={'black'}
            >
              {value}
            </Button>
          );
        })}
      </ButtonGroup>
      <Box
        display="flex"
        alignItems={'center'}
        justifyContent={'center'}
        sx={{ marginTop: 2, marginBottom: 1 }}
      >
        <Typography variant="body1">Examples in definitions</Typography>
        <Tooltip
          title="Extension of the game where you will also be asked to invent an example sentence using the word you are given"
          placement="top"
        >
          <InfoOutlinedIcon sx={{ marginLeft: 1 }} />
        </Tooltip>
      </Box>
      <ButtonGroup
        variant="outlined"
        disabled={!isAdmin}
        size="small"
        fullWidth
      >
        {useExampleOptions.map((value) => {
          return (
            <Button
              key={`useExampleOptions-${value}`}
              onClick={() => {
                setUseExample(value);
              }}
              variant={value === useExample ? 'contained' : 'outlined'}
              color={'black'}
            >
              {value ? 'Yes' : 'No'}
            </Button>
          );
        })}
      </ButtonGroup>
    </Grid>
  );
};

export default GameSettingsDisplayer;
