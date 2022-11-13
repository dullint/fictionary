import { Button, Grid, Input, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../../App';
import { createRoom, joinRoom } from '../../services/room';
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

  const handleJoinGame = async () => {
    if (roomId) {
      const entered = await joinRoom(socket, roomId).catch((err) => {
        setJoinRoomErrorMessage(err.message);
      });
      if (entered) navigate(`/room/${roomId}`);
    }
  };

  return (
    <Grid container direction="column">
      <Typography
        variant={'h1'}
        align={'center'}
        sx={{ marginTop: 5, marginBottom: 8 }}
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
            height: 40,
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
          <Input
            placeholder="Room ID"
            onChange={(e) => {
              setRoomId(e.target.value.toLocaleUpperCase());
              setJoinRoomErrorMessage(null);
            }}
            sx={{
              height: 40,
              flex: 1,
            }}
            // disableUnderline
            value={roomId}
            inputProps={{
              maxLength: 5,
              style: { textAlign: 'center', fontWeight: 900 },
            }}
          />
          <Button
            onClick={handleJoinGame}
            variant="contained"
            sx={{ marginLeft: 2, width: 'auto', height: 40 }}
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

/* CSS */
// .button-56 {
//   align-items: center;
//   background-color: #fee6e3;
//   border: 2px solid #111;
//   border-radius: 8px;
//   box-sizing: border-box;
//   color: #111;
//   cursor: pointer;
//   display: flex;
//   font-family: Inter,sans-serif;
//   font-size: 16px;
//   height: 48px;
//   justify-content: center;
//   line-height: 24px;
//   max-width: 100%;
//   padding: 0 25px;
//   position: relative;
//   text-align: center;
//   text-decoration: none;
//   user-select: none;
//   -webkit-user-select: none;
//   touch-action: manipulation;
// }

// .button-56:after {
//   background-color: #111;
//   border-radius: 8px;
//   content: "";
//   display: block;
//   height: 48px;
//   left: 0;
//   width: 100%;
//   position: absolute;
//   top: -2px;
//   transform: translate(8px, 8px);
//   transition: transform .2s ease-out;
//   z-index: -1;
// }

// .button-56:hover:after {
//   transform: translate(0, 0);
// }

// .button-56:active {
//   background-color: #ffdeda;
//   outline: 0;
// }

// .button-56:hover {
//   outline: 0;
// }

// @media (min-width: 768px) {
//   .button-56 {
//     padding: 0 40px;
//   }
// }
