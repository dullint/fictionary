import React, { useContext, useState } from 'react';
import { generateRandomRoomId } from './helpers';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../../App';
import { createRoom } from '../../services/room';
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

const CreateRoom = () => {
  const [maxPromptTime, setMaxPromptTime] = useState(1);
  const [roundNumber, setRoundNumber] = useState(3);
  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newRoomId = generateRandomRoomId();
    const gameSettings = {
      maxPromptTime,
      roundNumber,
    };
    const created = await createRoom(socket, newRoomId, gameSettings).catch(
      (err) => {
        console.log(err);
        alert(err.message);
      }
    );
    if (created) navigate(`/room/${newRoomId}`);
  };

  const handleCancel = () => {
    navigate('/');
  };

  const promptTimeOptions = [1, 2, 3, 4, 5];
  const roundNumberOptions = [1, 2, 3, 4, 5];

  return (
    <div className="createRoom">
      <h1>Create Room</h1>
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="max-time-label">Time</InputLabel>
        <Select
          labelId="max-time-label"
          defaultValue={1}
          value={maxPromptTime}
          onChange={(e) => setMaxPromptTime(Number(e.target.value))}
          label="Time"
          renderValue={(maxTime) => `${maxTime} min${maxTime > 1 ? 's' : ''}`}
        >
          {promptTimeOptions.map((value) => {
            return (
              <MenuItem value={value} key={value}>
                {`${value} min${value > 1 ? 's' : ''}`}
              </MenuItem>
            );
          })}
        </Select>
        <FormHelperText>Maximum time to write a definition</FormHelperText>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="round_number-label">Time</InputLabel>
        <Select
          labelId="round_number-label"
          defaultValue={3}
          value={roundNumber}
          onChange={(e) => setRoundNumber(Number(e.target.value))}
          label="Number"
        >
          {roundNumberOptions.map((value) => {
            return <MenuItem value={value}>{value}</MenuItem>;
          })}
        </Select>
        <FormHelperText>Number of rounds</FormHelperText>
      </FormControl>
      <Button onClick={handleSubmit}>Create Room</Button>
      <Button onClick={handleCancel}>Cancel</Button>
    </div>
  );
};

export default CreateRoom;
