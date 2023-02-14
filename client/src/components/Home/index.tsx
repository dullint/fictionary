import { Button, Grid, Input, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom, joinRoom } from '../../actions';
import { theme } from '../../theme';
import { generateRandomRoomId } from '../GameSettingsDialog/helpers';
import { Box } from '@mui/system';
import { TypeAnimation } from 'react-type-animation';
import { getTypingSequence } from './helpers';
import HowToPlay from '../HowToPlay';

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [joinRoomError, setJoinRoomError] = useState<string | null>(null);

  const handleCreateGame = async (event) => {
    event.preventDefault();
    const newRoomId = generateRandomRoomId();
    const created = await createRoom(newRoomId);
    if (created) navigate(`/room/${newRoomId}`);
  };

  const handleJoinGame = async () => {
    if (roomId) {
      await joinRoom(roomId)
        .then((room) => {
          navigate(`/room/${roomId}`);
        })
        .catch((error) => {
          setJoinRoomError(error);
        });
    }
  };

  return (
    <Grid container direction="column" alignItems={'center'}>
      <Box
        sx={{
          marginBottom: 2,
          maxWidth: {
            xs: 300,
            sm: 400,
            md: 450,
            lg: 500,
            xl: 500,
          },
        }}
      >
        <Typography variant={'h1'}>Fictionary</Typography>
        <Box
          sx={{
            minHeight: 90,
          }}
        >
          <Typography
            component="span"
            fontStyle={'italic'}
            fontSize={20}
            fontFamily="bespoke-light-italic"
            sx={{ marginRight: 0.5 }}
          >
            {'proper noun: '}
          </Typography>
          <TypeAnimation
            sequence={getTypingSequence()}
            wrapper="span"
            cursor={true}
            repeat={Infinity}
            deletionSpeed={70}
            speed={50}
            style={{ fontSize: 20, fontFamily: 'bespoke-regular' }}
          />
        </Box>
      </Box>
      <Grid
        container
        direction="column"
        alignItems={'center'}
        width="auto"
        sx={{ marginBottom: 5 }}
      >
        <Button
          onClick={handleCreateGame}
          variant="contained"
          sx={{
            width: { xs: 300, sm: 400 },
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
          sx={{
            width: { xs: 300, sm: 400 },
          }}
        >
          <Grid container>
            <Input
              placeholder="Room ID"
              onChange={(e) => {
                setRoomId(e.target.value.toLocaleUpperCase());
                setJoinRoomError(null);
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
              sx={{ marginLeft: 2, width: { xs: 'auto', sm: 200 }, height: 60 }}
            >
              Join game
            </Button>
          </Grid>
          {joinRoomError && (
            <Typography sx={{ color: theme.palette.secondary.main }}>
              {joinRoomError}
            </Typography>
          )}
        </Grid>
      </Grid>
      {/* <Button
        onClick={() => setIsHowToPlayDialogOpen(true)}
        variant="outlined"
        sx={{ width: { xs: 300, sm: 400 }, height: 60, marginTop: 5 }}
      >
        How to play ?
      </Button> */}
      {/* <Dialog
        open={isHowToPlayDialogOpen}
        onClose={() => setIsHowToPlayDialogOpen(false)}
      >
        <DialogContent
          sx={{
            backgroundColor: theme.palette.yellow.main,
            border: '4px solid black',
          }}
        > */}
      <HowToPlay />
      {/* </DialogContent> */}
      {/* </Dialog> */}
    </Grid>
  );
};

export default Home;
