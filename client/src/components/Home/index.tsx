import { Button, Grid, Input, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../../App';
import { createRoom, joinRoom } from '../../services/room';
import { theme } from '../../theme';
import { DEFAULT_GAME_SETTINGS } from '../GameSettingsDialog/constants';
import { generateRandomRoomId } from '../GameSettingsDialog/helpers';

const Home = () => {
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const [roomId, setRoomId] = useState('');
  const [joinRoomErrorMessage, setJoinRoomErrorMessage] = useState(null);

  const handleCreateGame = async (event) => {
    event.preventDefault();
    const newRoomId = generateRandomRoomId();
    const created = await createRoom(socket, newRoomId, DEFAULT_GAME_SETTINGS);
    if (created) navigate(`/room/${newRoomId}`, { state: { fromHome: true } });
  };

  const handleJoinGame = async () => {
    if (roomId) {
      const entered = await joinRoom(socket, roomId).catch((err) => {
        setJoinRoomErrorMessage(err.message);
      });
      if (entered) navigate(`/room/${roomId}`, { state: { fromHome: true } });
    }
  };

  return (
    <Grid container direction="column">
      <Typography
        variant={'h1'}
        align={'center'}
        sx={{
          marginTop:
            isMobile && window?.screen?.orientation?.angle === 90 ? 0 : 5,
          marginBottom:
            isMobile && window?.screen?.orientation?.angle === 90 ? 3 : 8,
        }}
      >
        Fictionary
      </Typography>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems={'center'}
        width="auto"
      >
        <Button
          onClick={handleCreateGame}
          variant="contained"
          sx={{
            alignSelf: 'center',
            width: 300,
            height: 60,
            marginBottom: 4,
          }}
        >
          Create game
        </Button>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: 300, margin: 2 }}
        >
          <Grid container>
            <Input
              placeholder="Room ID"
              onChange={(e) => {
                setRoomId(e.target.value.toLocaleUpperCase());
                setJoinRoomErrorMessage(null);
              }}
              sx={{
                height: 60,
                flex: 1,
              }}
              value={roomId}
              inputProps={{
                maxLength: 5,
                style: { textAlign: 'center', fontWeight: 900, fontSize: 24 },
              }}
            />
            <Button
              onClick={handleJoinGame}
              variant="contained"
              sx={{ marginLeft: 2, width: 'auto', height: 60 }}
            >
              Join game
            </Button>
          </Grid>
          {joinRoomErrorMessage && (
            <Typography sx={{ color: theme.palette.secondary.main }}>
              {joinRoomErrorMessage}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Home;
