import React, { useContext, useState } from 'react';
import { generateRandomRoomId } from './helpers';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../../App';
import { createRoom } from '../../services/room';
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { GameSettings } from '../../../../server/src/game/types';

export interface PropsType {
  open: boolean;
  setOpen: (bool: boolean) => void;
  isAdmin: boolean;
}

const GameSettingsDialog = (props: PropsType) => {
  const { open, setOpen, isAdmin } = props;
  const [maxPromptTime, setMaxPromptTime] = useState(1);
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
          <Typography variant={'subtitle1'} sx={{ m: 1 }}>
            Number of rounds:
          </Typography>
          <ButtonGroup variant="outlined">
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
            Max writing time:
          </Typography>
          <ButtonGroup variant="outlined">
            {promptTimeOptions.map((value) => {
              return (
                <Button
                  sx={{ textTransform: 'none' }}
                  onClick={(e) => setMaxPromptTime(value)}
                  variant={value === maxPromptTime ? 'contained' : 'outlined'}
                >{`${value} min${value > 1 ? 's' : ''}`}</Button>
              );
            })}
          </ButtonGroup>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ marginTop: 3 }}
          >
            Save settings
          </Button>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default GameSettingsDialog;
