import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Grid, Typography } from '@mui/material';
import { theme } from '../../theme';
import { Box } from '@mui/system';
import socket from '../../socket';
import { useParams } from 'react-router-dom';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';

export interface Propstype {
  open: boolean;
  setOpen: (bool: boolean) => void;
  handleCopyToClipboard: () => void;
}

const PlayerAloneDialog = (props: Propstype) => {
  const { open, setOpen, handleCopyToClipboard } = props;
  const { roomId } = useParams();

  const handlePlay = () => {
    socket.emit('launch_game', { roomId });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogContent
        sx={{
          backgroundColor: theme.palette.yellow.main,
          border: '4px solid black',
        }}
      >
        <Grid
          container
          direction="column"
          alignItems={'center'}
          justifyContent="center"
        >
          <Typography variant="h6" sx={{ marginBottom: 1 }} align="center">
            You are alone in the room.
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ marginBottom: 1 }}
            align="center"
          >
            The game is made to be played with friends. But you can test the
            game alone if you want.
          </Typography>
          <Box display={'flex'} width={1} sx={{ marginTop: 1 }}>
            <Button
              startIcon={<PersonAddAltRoundedIcon />}
              onClick={() => {
                handleCancel();
                handleCopyToClipboard();
              }}
              variant="contained"
              fullWidth
              sx={{ margin: 1 }}
            >
              <Typography variant="button">Invite</Typography>
            </Button>
            <Button
              startIcon={<PlayArrowRoundedIcon />}
              onClick={handlePlay}
              variant="outlined"
              fullWidth
              sx={{ margin: 1 }}
            >
              play
            </Button>
          </Box>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerAloneDialog;
