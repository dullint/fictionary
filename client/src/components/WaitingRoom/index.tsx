import {
  Avatar,
  Button,
  Grid,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SocketContext } from '../../App';
import { PlayerContext } from '../Room';
import UsernameDialog from '../UsernameDialog';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { getPlayTooltip, isRoomAdmin } from './helpers';
import GameSettingsDialog from '../GameSettingsDialog';
import SettingsIcon from '@mui/icons-material/Settings';
import { getMyPlayer } from '../WordGuess/helpers';

const WaitingRoom = () => {
  const socket = useContext(SocketContext);
  const players = useContext(PlayerContext);
  const [openUsernameDialog, setOpenUsernameDialog] = useState(
    !getMyPlayer(players, socket.id)?.username
  );
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const [copyToClipboardMsg, setCopyToClipboardMsg] = useState(false);
  const navigate = useNavigate();
  const { roomId } = useParams();
  const isAdmin = isRoomAdmin(players, socket.id);

  const handlePlay = () => {
    socket.emit('new_round', { roomId });
  };

  const handleLeaveRoom = () => {
    socket.emit('leave-room', { roomId });
    navigate('/');
  };

  const handleChangeGameSettings = () => {
    setOpenSettingsDialog(true);
  };

  const handleCopyToClipboard = () => {
    setCopyToClipboardMsg(true);
    navigator.clipboard.writeText(window.location.href);
  };

  const allPlayersHaveAUsername = players
    .map((player) => player?.username)
    .every((username) => username);

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
      <Typography variant="h3">{roomId}</Typography>
      <Grid container alignContent={'center'} justifyContent="center">
        <Typography display="flex" alignItems={'center'}>
          Send the link to your friends:{' '}
        </Typography>
        <Button
          onClick={handleCopyToClipboard}
          sx={{ m: 0 }}
          endIcon={<ContentCopyIcon />}
        >
          <Typography>{`/room/${roomId}`}</Typography>
        </Button>
      </Grid>
      <Snackbar
        open={copyToClipboardMsg}
        onClose={() => setCopyToClipboardMsg(false)}
        autoHideDuration={2000}
        message="Copied to clipboard"
      />
      <Button
        color="primary"
        onClick={handleChangeGameSettings}
        size="large"
        variant="outlined"
        endIcon={<SettingsIcon />}
      >
        Game settings
      </Button>
      <Grid
        container
        justifyContent="center"
        sx={{ marginTop: 2, marginBottom: 2 }}
        maxWidth={500}
      >
        {players &&
          players.map((player) => (
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              sx={{ maxWidth: 130 }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  m: 1,
                  bgcolor: player.color,
                }}
              />
              <Typography variant="subtitle1" align="center">
                {player.username}
              </Typography>
            </Grid>
          ))}
      </Grid>
      <Tooltip
        title={getPlayTooltip(isAdmin, allPlayersHaveAUsername)}
        placement="top"
      >
        <span>
          <Button
            onClick={handlePlay}
            variant="contained"
            size="large"
            sx={{ m: 1 }}
            disabled={!isAdmin || !allPlayersHaveAUsername}
          >
            Play
          </Button>
        </span>
      </Tooltip>

      <Button onClick={handleLeaveRoom} size="large" sx={{ m: 1 }}>
        Leave Room
      </Button>
      <UsernameDialog
        open={openUsernameDialog}
        setOpen={setOpenUsernameDialog}
      />
      <GameSettingsDialog
        open={openSettingsDialog}
        setOpen={setOpenSettingsDialog}
        isAdmin={isAdmin}
      />
    </Grid>
  );
};

export default WaitingRoom;
