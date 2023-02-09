import React, { useContext, useState } from 'react';
import { SocketContext } from '../../App';
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  Grid,
  Typography,
} from '@mui/material';
import { GameSettings } from '../../../../server/src/game/types';
import { theme } from '../../theme';
import {
  promptTimeOptions,
  roundNumberOptions,
  showGuessVoteOptions,
  useExampleOptions,
} from './constants';
import { GameContext } from '../Room';

export interface PropsType {
  open: boolean;
  setOpen: (bool: boolean) => void;
  isAdmin: boolean;
}

const GameSettingsDialog = (props: PropsType) => {
  const { open, setOpen, isAdmin } = props;
  const game = useContext(GameContext);
  const gameSettings = game.gameSettings;
  const [maxPromptTime, setMaxPromptTime] = useState(
    gameSettings.maxPromptTime
  );
  const [useExample, setUseExample] = useState(gameSettings.useExample);
  const [roundNumber, setRoundNumber] = useState(gameSettings.roundNumber);
  const [showGuessVote, setShowGuessVote] = useState(
    gameSettings.showGuessVote
  );
  const socket = useContext(SocketContext);

  const handleSubmit = () => {
    setOpen(false);
    const newGameSettings: GameSettings = {
      maxPromptTime,
      roundNumber,
      useExample,
      showGuessVote,
    };
    socket.emit('change_game_settings', { gameSettings: newGameSettings });
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogContent
        sx={{
          backgroundColor: theme.palette.yellow.main,
          border: '4px solid black',
        }}
      >
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant={'h5'} sx={{ m: 1 }}>
            Game Settings
          </Typography>
          {!isAdmin && (
            <Typography variant={'body1'}>
              Only the admin can change the settings
            </Typography>
          )}
          <Typography variant={'subtitle1'} sx={{ m: 1 }}>
            Number of rounds:
          </Typography>
          <ButtonGroup variant="outlined" disabled={!isAdmin}>
            {roundNumberOptions.map((value) => {
              return (
                <Button
                  sx={{
                    '&:hover': {
                      boxShadow: value === roundNumber ? '5px 5px black' : null,
                    },
                  }}
                  onClick={(e) => setRoundNumber(value)}
                  variant={value === roundNumber ? 'contained' : 'outlined'}
                  key={`roundNumberOptions-${value}`}
                >
                  {value}
                </Button>
              );
            })}
          </ButtonGroup>
          <Typography
            variant="subtitle1"
            sx={{ marginTop: 3, marginBottom: 1 }}
          >
            Max writing time (Min):
          </Typography>
          <ButtonGroup variant="outlined" disabled={!isAdmin}>
            {promptTimeOptions.map((value) => {
              return (
                <Button
                  sx={{
                    textTransform: 'none',
                    '&:hover': {
                      boxShadow:
                        value === maxPromptTime ? '5px 5px black' : null,
                    },
                  }}
                  key={`promptTimeOptions-${value}`}
                  onClick={(e) => setMaxPromptTime(value)}
                  variant={value === maxPromptTime ? 'contained' : 'outlined'}
                >
                  {value}
                </Button>
              );
            })}
          </ButtonGroup>
          <Typography
            variant="subtitle1"
            sx={{ marginTop: 3, marginBottom: 1 }}
          >
            Examples in definitions
          </Typography>
          <ButtonGroup variant="outlined" disabled={!isAdmin}>
            {useExampleOptions.map((value) => {
              return (
                <Button
                  sx={{
                    '&:hover': {
                      boxShadow: value === useExample ? '5px 5px black' : null,
                    },
                  }}
                  key={`useExampleOptions-${value}`}
                  onClick={(e) => setUseExample(value)}
                  variant={value === useExample ? 'contained' : 'outlined'}
                >
                  {value ? 'Yes' : 'No'}
                </Button>
              );
            })}
          </ButtonGroup>
          <Typography
            variant="subtitle1"
            sx={{ marginTop: 3, marginBottom: 1 }}
          >
            Show live players vote
          </Typography>
          <ButtonGroup variant="outlined" disabled={!isAdmin}>
            {showGuessVoteOptions.map((value) => {
              return (
                <Button
                  sx={{
                    '&:hover': {
                      boxShadow:
                        value === showGuessVote ? '5px 5px black' : null,
                    },
                  }}
                  key={`showGuessVoteOptions-${value}`}
                  onClick={(e) => setShowGuessVote(value)}
                  variant={value === showGuessVote ? 'contained' : 'outlined'}
                >
                  {value ? 'Yes' : 'No'}
                </Button>
              );
            })}
          </ButtonGroup>
          <Button
            onClick={isAdmin ? handleSubmit : () => setOpen(false)}
            variant="contained"
            sx={{ marginTop: 5 }}
          >
            {isAdmin ? 'Save settings' : 'Close'}
          </Button>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default GameSettingsDialog;
