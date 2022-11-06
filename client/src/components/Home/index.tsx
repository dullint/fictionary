import { Button, Grid, TextField, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../../App';
import { createRoom, joinRoom } from '../../services/room';
import { generateRandomRoomId } from '../GameSettingsDialog/helpers';
import { defaultGameSettings } from './constants';

const Home = () => {
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const [roomId, setRoomId] = useState('');
  const [joinRoomErrorMessage, setJoinRoomErrorMessage] = useState(null);

  const handleCreateGame = async (event) => {
    event.preventDefault();
    const newRoomId = generateRandomRoomId();
    const created = await createRoom(socket, newRoomId, defaultGameSettings);
    if (created) navigate(`/room/${newRoomId}`);
  };

  const handleEnterRoom = async () => {
    if (roomId) {
      const entered = await joinRoom(socket, roomId).catch((err) => {
        setJoinRoomErrorMessage(err.message);
      });
      if (entered) navigate(`/room/${roomId}`);
    }
  };

  return (
    <Grid container direction="column">
      <Typography variant={'h3'} align={'center'} sx={{ m: 3 }}>
        Fictionnary
      </Typography>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems={'center'}
      >
        <Button
          onClick={handleCreateGame}
          variant="contained"
          sx={{ alignSelf: 'center', width: 300, height: 40 }}
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
          <TextField
            placeholder="Room Id"
            onChange={(e) => {
              setRoomId(e.target.value.toLocaleUpperCase());
              setJoinRoomErrorMessage(null);
            }}
            sx={{ width: 150, backgroundColor: 'white' }}
            value={roomId}
            inputProps={{ maxLength: 5, style: { textAlign: 'center' } }}
            size="small"
          />
          <Button
            onClick={handleEnterRoom}
            variant="contained"
            sx={{ marginLeft: 2, width: 130, height: 40 }}
          >
            Join game
          </Button>
          {joinRoomErrorMessage && (
            <Typography sx={{ color: 'red' }}>
              {joinRoomErrorMessage}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

Home.propTypes = {};

export default Home;
