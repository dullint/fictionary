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
import Avatar from '../Avatar';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { theme } from '../../theme';
import { bottomPageButtonSx } from '../../constants/style';
import { getMyPlayer } from '../DefinitionList/helpers';

const WaitingRoom = () => {
  const socket = useContext(SocketContext);
  const players = useContext(PlayerContext);
  const username = getMyPlayer(players, socket?.id)?.username;
  const [openUsernameDialog, setOpenUsernameDialog] = useState(!username);
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
      <Grid
        alignItems="center"
        container
        justifyContent="space-between"
        direction="row"
      >
        <Button
          startIcon={<ArrowBackIosIcon />}
          variant="outlined"
          onClick={handleLeaveRoom}
          size="small"
        >
          Back
        </Button>
        <Button
          color="primary"
          onClick={handleChangeGameSettings}
          size="small"
          variant="outlined"
          endIcon={<SettingsIcon />}
        >
          Game settings
        </Button>
      </Grid>
      <Typography variant="body1" align="center" sx={{ marginTop: 2 }}>
        Your room code is
      </Typography>
      <Typography variant="h2" color={theme.palette.pink.main}>
        {roomId}
      </Typography>
      <Grid container alignContent={'center'} justifyContent="center">
        <Button
          onClick={handleCopyToClipboard}
          sx={{ m: 0 }}
          endIcon={<ContentCopyIcon />}
        >
          <Typography>Click to copy the link</Typography>
        </Button>
      </Grid>
      <Snackbar
        open={copyToClipboardMsg}
        onClose={() => setCopyToClipboardMsg(false)}
        autoHideDuration={2000}
        message="Copied to clipboard"
      />
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
              key={player.socketId}
            >
              <Avatar player={player} displayBadge={false} size="medium" />
              <Typography variant="subtitle1" align="center">
                {player?.username}
              </Typography>
            </Grid>
          ))}
      </Grid>
      <Tooltip
        title={getPlayTooltip(isAdmin, allPlayersHaveAUsername)}
        placement="top"
        arrow
      >
        <span>
          <Button
            onClick={handlePlay}
            variant="contained"
            sx={bottomPageButtonSx}
            disabled={!isAdmin || !allPlayersHaveAUsername}
          >
            Play
          </Button>
        </span>
      </Tooltip>
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
