import {
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../../App';
import { joinRoom } from '../../services/room';
import { css } from '@emotion/react';

const Home = () => {
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const [roomId, setRoomId] = useState('');

  const handleCreateGame = () => {
    navigate('room/create-room');
  };

  const handleEnterRoom = async () => {
    if (roomId) {
      const entered = await joinRoom(socket, roomId).catch((err) => {
        alert(err.message);
      });
      if (entered) navigate(`/room/${roomId}`);
    }
  };

  return (
    <Grid container direction="column" justifyContent="center">
      <Typography
        variant={'h3'}
        align={'center'}
        sx={{ marginBottom: 5, marginTop: 5 }}
      >
        Fictionnary
      </Typography>
      <Button
        onClick={handleCreateGame}
        variant="contained"
        sx={{ alignSelf: 'center' }}
      >
        Create game
      </Button>
      <Divider sx={{ margin: 2 }} />
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
      >
        <TextField
          placeholder="Room Id"
          onChange={(e) => setRoomId(e.target.value)}
          sx={{ width: 150, backgroundColor: 'white' }}
          inputProps={{ maxLength: 5, style: { textAlign: 'center' } }}
          size="small"
        />
        <Button
          onClick={handleEnterRoom}
          variant="contained"
          sx={{ margin: 2 }}
        >
          Join game
        </Button>
      </Grid>
    </Grid>
  );
};

Home.propTypes = {};

export default Home;
