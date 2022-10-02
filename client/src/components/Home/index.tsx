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
      <button onClick={handleCreateGame}>Create a game</button>
      <div>
        <input
          placeholder="Room Id"
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={handleEnterRoom}>Join a game</button>
      </div>
    </div>
  );
};

Home.propTypes = {};

export default Home;
