import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SocketContext } from '../../App';
import { PlayerContext } from '../Room';
import UsernameDialog from '../UsernameDialog';

const WaitingRoom = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const { roomId } = useParams();
  const socket = useContext(SocketContext);
  const players = useContext(PlayerContext);

  const handlePlay = () => {
    socket.emit('begin_game');
  };

  const handleLeaveRoom = () => {
    socket.emit('leave_room', { roomId });
    navigate('/');
  };

  return (
    <div>
      <h1>WaitingRoom {roomId}</h1>
      <h2>Players in the room:</h2>
      {players && players.map((player) => <div>{player.username}</div>)}
      <div>
        <button onClick={handlePlay}>Play</button>
        <button onClick={handleLeaveRoom}>Leave Room</button>
      </div>
      <UsernameDialog open={openDialog} setOpen={setOpenDialog} />
    </div>
  );
};

export default WaitingRoom;
