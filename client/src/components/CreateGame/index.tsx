import React, { useContext, useState } from 'react';
import { generateRandomRoomId } from './helpers';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../../App';
import { createRoom } from '../../services/room';
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
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
    console.log(gameSettings);
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

  const promptTimeOptions = [1, 2, 3, 4, 5, 10000];
  const roundNumberOptions = [2, 3, 4, 5];

  const fromControleSx = { m: 1, minWidth: 80 };

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Typography
        variant={'h5'}
        align={'center'}
        sx={{ marginBottom: 5, marginTop: 5 }}
      >
        Game settings
      </Typography>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={3}>
              <Typography variant={'body1'}>Max writing time:</Typography>
            </Grid>
            <Grid item xs={2}>
              <FormControl sx={fromControleSx}>
                <InputLabel id="max-time-label">Time</InputLabel>
                <Select
                  labelId="max-time-label"
                  defaultValue={1}
                  value={maxPromptTime}
                  onChange={(e) => setMaxPromptTime(Number(e.target.value))}
                  label="Time"
                  renderValue={(maxTime) =>
                    `${maxTime} min${maxTime > 1 ? 's' : ''}`
                  }
                  size="small"
                >
                  {promptTimeOptions.map((value) => {
                    return (
                      <MenuItem value={value} key={value}>
                        {`${value} min${value > 1 ? 's' : ''}`}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={3}>
              <Typography variant={'body1'}>Number of rounds:</Typography>
            </Grid>
            <Grid item xs={2}>
              <FormControl sx={fromControleSx}>
                <InputLabel id="round_number-label">Number</InputLabel>
                <Select
                  labelId="round_number-label"
                  defaultValue={3}
                  value={roundNumber}
                  onChange={(e) => setRoundNumber(Number(e.target.value))}
                  label="Number"
                  size="small"
                >
                  {roundNumberOptions.map((value) => {
                    return <MenuItem value={value}>{value}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Button onClick={handleSubmit} variant="contained" sx={{ m: 2 }}>
        Create Room
      </Button>
      <Button onClick={handleCancel}>Cancel</Button>
    </Grid>
  );
};

export default CreateRoom;
