import { Avatar, Button, Grid, Snackbar, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SocketContext } from '../../App';
import { PlayerContext } from '../Room';
import UsernameDialog from '../UsernameDialog';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const WaitingRoom = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [copyToClipboardMsg, setCopyToClipboardMsg] = useState(false);
  const navigate = useNavigate();
  const { roomId } = useParams();
  const socket = useContext(SocketContext);
  const players = useContext(PlayerContext);

  const handlePlay = () => {
    socket.emit('new_round', { roomId });
  };

  const handleLeaveRoom = () => {
    socket.emit('leave_room', { roomId });
    navigate('/');
  };

  const handleCopyToClipboard = () => {
    setCopyToClipboardMsg(true);
    navigator.clipboard.writeText(roomId);
  };

  console.log(players);
  return (
    <Grid
      alignItems="center"
      container
      justifyContent="center"
      direction="column"
    >
      <Typography variant="h6" align="center">
        Room code:
      </Typography>
      <Button
        onClick={handleCopyToClipboard}
        sx={{ m: 2 }}
        endIcon={<ContentCopyIcon />}
      >
        <Typography sx={{ fontSize: 40 }}>{roomId}</Typography>
      </Button>
      <Snackbar
        open={copyToClipboardMsg}
        onClose={() => setCopyToClipboardMsg(false)}
        autoHideDuration={2000}
        message="Copied to clipboard"
      />
      <Grid container justifyContent="center" spacing={1} sx={{ m: 2 }}>
        {players &&
          players.map((player) => (
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              xs={4}
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  m: 1,
                  bgcolor: player.color,
                }}
              />
              <Typography variant="body1" align="center">
                {player.username}
              </Typography>
            </Grid>
          ))}
      </Grid>
      <Button
        onClick={handlePlay}
        variant="contained"
        size="large"
        sx={{ m: 2 }}
      >
        Play
      </Button>
      <Button onClick={handleLeaveRoom} size="large">
        Leave Room
      </Button>
      <UsernameDialog open={openDialog} setOpen={setOpenDialog} />
    </Grid>
  );
};

export default WaitingRoom;
