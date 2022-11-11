import { Button, Grid, Snackbar, Tooltip, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SocketContext } from '../../App';
import { PlayerContext } from '../Room';
import UsernameDialog from '../UsernameDialog';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { getPlayTooltip, isRoomAdmin } from './helpers';
import GameSettingsDialog from '../GameSettingsDialog';
import SettingsIcon from '@mui/icons-material/Settings';
import { getMyPlayer } from '../WordGuess/helpers';
import Avatar from '../Avatar';

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
    socket.emit('leave_room', { roomId });
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
      height={1}
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
        alignItems={'center'}
        sx={{ marginTop: 2, marginBottom: 2, overflowY: 'auto', flex: 1 }}
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
              <Avatar player={player} />
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

      <Button onClick={handleLeaveRoom} size="large">
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
