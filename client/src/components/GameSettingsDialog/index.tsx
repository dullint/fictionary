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
import { GameSettings } from '../../../../server/game/types';

export interface PropsType {
  open: boolean;
  setOpen: (bool: boolean) => void;
  isAdmin: boolean;
}

const GameSettingsDialog = (props: PropsType) => {
  const { open, setOpen, isAdmin } = props;
  const [maxPromptTime, setMaxPromptTime] = useState(3);
  const [roundNumber, setRoundNumber] = useState(3);
  const socket = useContext(SocketContext);

  const handleSubmit = () => {
    setOpen(false);
    const newGameSettings: GameSettings = { maxPromptTime, roundNumber };
    socket.emit('change_game_settings', { gameSettings: newGameSettings });
  };

  const promptTimeOptions = [1, 2, 3, 4, 5];
  const roundNumberOptions = [2, 3, 4, 5];

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogContent>
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
                  sx={{ minWidth: 100 }}
                  onClick={(e) => setRoundNumber(value)}
                  variant={value === roundNumber ? 'contained' : 'outlined'}
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
                  sx={{ textTransform: 'none' }}
                  onClick={(e) => setMaxPromptTime(value)}
                  variant={value === maxPromptTime ? 'contained' : 'outlined'}
                >
                  {value}
                </Button>
              );
            })}
          </ButtonGroup>
          <Button
            onClick={isAdmin ? handleSubmit : () => setOpen(false)}
            variant="contained"
            sx={{ marginTop: 3 }}
          >
            {isAdmin ? 'Save settings' : 'Close'}
          </Button>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default GameSettingsDialog;
