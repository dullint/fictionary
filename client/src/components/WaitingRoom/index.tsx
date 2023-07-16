import { Box, Button, Grid, Snackbar, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RoomContext } from '../Room';
import UsernameDialog from '../UsernameDialog';
import { getMyPlayer } from './helpers';
import Avatar from '../Avatar';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { theme } from '../../theme';
import socket from '../../socket';
import { getInGamePlayers } from '../Room/helpers';
import GameSettingsDisplayer from '../GameSettingsDisplayer';

const WaitingRoom = () => {
  const { players } = useContext(RoomContext);
  const inGamePlayers = getInGamePlayers(players);

  const myPlayer = getMyPlayer(players);
  const myUsername = myPlayer?.username;
  const isAdmin = myPlayer?.isAdmin;

  const [openUsernameDialog, setOpenUsernameDialog] = useState(!myUsername);
  const [showCopiedToClipboard, setShowCopiedToClipboard] = useState(false);

  // useEffect(() => {
  //   setTimeout(() => setShowCopiedToClipboard(false), 2000);
  // });

  const navigate = useNavigate();
  const { roomId } = useParams();

  const handlePlay = () => {
    socket.emit('launch_game', { roomId });
  };

  const handleLeaveRoom = () => {
    socket.emit('leave_room', { roomId });
    navigate('/');
  };

  const handleCopyToClipboard = () => {
    setShowCopiedToClipboard(true);
    navigator.clipboard.writeText(window.location.href);
  };

  const allInGamePlayersHaveAUsername = inGamePlayers
    .map((player) => player.username)
    .every((username) => username);

  return (
    <Grid alignItems="center" container justifyContent="center" height={1}>
      <Box
        alignItems="center"
        width={1}
        display={'flex'}
        flexDirection="row"
        justifyContent="space-between"
      >
        <Button
          startIcon={<ArrowBackIosNewRoundedIcon />}
          variant="outlined"
          onClick={handleLeaveRoom}
          size="small"
          sx={{ justifySelf: 'start' }}
        >
          <Typography variant="body1" align="center" sx={{ marginLeft: -0.5 }}>
            Back
          </Typography>
        </Button>
        <Box>
          <Typography variant="body1" align="center">
            Room code
          </Typography>
          <Typography
            variant="h2"
            color={theme.palette.pink.main}
            sx={{ marginTop: -1.2 }}
          >
            {roomId}
          </Typography>
        </Box>
        {/* Just for centering */}
        <Button
          startIcon={<ArrowBackIosNewRoundedIcon fontSize="large" />}
          variant="outlined"
          onClick={handleLeaveRoom}
          size="small"
          sx={{ justifySelf: 'start', visibility: 'hidden' }}
        >
          Back
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          paddingTop: 2, //to be able to show the admin crown
          overflowX: 'auto',
          width: 1,
        }}
      >
        {inGamePlayers.map((player) => (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            margin={1}
            width={70}
          >
            <Avatar
              player={player}
              displayBadge={false}
              size="medium"
              showCrown={true}
            />
            <Typography
              variant="body1"
              align="center"
              textOverflow="ellipsis"
              overflow={'hidden'}
              sx={{ flex: 1, width: 1 }}
            >
              {player.username}
            </Typography>
          </Box>
        ))}
      </Box>
      <GameSettingsDisplayer isAdmin={isAdmin} />
      <Box display={'flex'} width={1} sx={{ marginTop: 1 }}>
        <Button
          startIcon={<PersonAddAltRoundedIcon />}
          onClick={handleCopyToClipboard}
          variant="contained"
          fullWidth
          sx={{ margin: 1 }}
        >
          <Typography variant="button">Invite</Typography>
        </Button>
        <Button
          startIcon={<PlayArrowRoundedIcon />}
          onClick={handlePlay}
          variant="contained"
          disabled={!isAdmin || !allInGamePlayersHaveAUsername}
          fullWidth
          sx={{ margin: 1 }}
        >
          Play
        </Button>
      </Box>
      <UsernameDialog
        open={openUsernameDialog}
        setOpen={setOpenUsernameDialog}
      />
      <Snackbar
        open={showCopiedToClipboard}
        autoHideDuration={2000}
        onClose={() => setShowCopiedToClipboard(false)}
        message="Invite Link copied to clipboard"
      />
    </Grid>
  );
};

export default WaitingRoom;
