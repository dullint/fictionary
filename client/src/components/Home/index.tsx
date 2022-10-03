import { Button, TextField } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../../App';
import { joinRoom } from '../../services/room';

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
    <div className="Home">
      <h1>Home</h1>
      <Button onClick={handleCreateGame}>Create game</Button>
      <div>
        <TextField
          placeholder="Room Id"
          onChange={(e) => setRoomId(e.target.value)}
        />
        <Button onClick={handleEnterRoom}>Join game</Button>
      </div>
    </div>
  );
};

Home.propTypes = {};

export default Home;
