import {
  Box,
  Button,
  Grid,
  Snackbar,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RoomContext } from '../Room';
import UsernameDialog from '../UsernameDialog';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { getMyPlayer, getPlayTooltip } from './helpers';
import GameSettingsDialog from '../GameSettingsDialog';
import SettingsIcon from '@mui/icons-material/Settings';
import Avatar from '../Avatar';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { theme } from '../../theme';
import { bottomPageButtonSx } from '../../constants/style';
import socket from '../../socket';
import { getInGamePlayers } from '../Room/helpers';

const WaitingRoom = () => {
  const { players } = useContext(RoomContext);
  const inGamePlayers = getInGamePlayers(players);

  const myPlayer = getMyPlayer(players);
  const myUsername = myPlayer?.username;
  const isAdmin = myPlayer?.isAdmin;

  const [openUsernameDialog, setOpenUsernameDialog] = useState(!myUsername);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const [copyToClipboardMsg, setCopyToClipboardMsg] = useState(false);
  const navigate = useNavigate();
  const { roomId } = useParams();

  const handlePlay = () => {
    socket.emit('launch_game', { roomId });
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

  const allInGamePlayersHaveAUsername = inGamePlayers
    .map((player) => player.username)
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
      <Box
        sx={{
          paddingTop: 4, //to be able to show the admin crown
          marginTop: 3,
          marginBottom: 2,
          overflowY: 'auto',
          flex: 1,
          width: 1,
        }}
      >
        <Grid container spacing={2}>
          {inGamePlayers.map((player) => (
            <Grid item xs={4} sm={3} key={player.userId}>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <Avatar
                  player={player}
                  displayBadge={false}
                  size="medium"
                  showCrown={true}
                />
                <Typography
                  variant="subtitle1"
                  align="center"
                  textOverflow="ellipsis"
                  overflow={'hidden'}
                  sx={{ flex: 1, width: 1 }}
                >
                  {player.username}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Tooltip
        title={getPlayTooltip(isAdmin, allInGamePlayersHaveAUsername)}
        placement="top"
        arrow
      >
        <span>
          <Button
            onClick={handlePlay}
            variant="contained"
            sx={bottomPageButtonSx}
            disabled={!isAdmin || !allInGamePlayersHaveAUsername}
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
