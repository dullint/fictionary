import { Button, Grid, Input, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../theme';
import { generateRandomRoomId } from '../GameSettingsDialog/helpers';
import { Box } from '@mui/system';
import { TypeAnimation } from 'react-type-animation';
import { getTypingSequence } from './helpers';
import HowToPlay from '../HowToPlay';
import socket from '../../socket';
import { ServerResponse } from '../../../../server/src/socket/types';
import CreditsDialog from '../CreditsDialog';

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [joinRoomError, setJoinRoomError] = useState<string | null>(null);
  const [openCredits, setOpenCredits] = useState(false);

  const handleCreateGame = async (event) => {
    event.preventDefault();
    const newRoomId = generateRandomRoomId();
    const callback = (response: ServerResponse) => {
      if (response.success) navigate(`/room/${newRoomId}`);
    };
    socket.emit('create_room', newRoomId, callback);
  };

  const handleJoinGame = async () => {
    if (roomId) {
      const callback = (response: ServerResponse) => {
        const { error, success } = response;
        if (success) navigate(`/room/${roomId}`);
        if (error) setJoinRoomError(error);
      };
      socket.emit('join_room', roomId, callback);
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
        sx={{ marginBottom: 3 }}
      >
        <Button
          onClick={handleCreateGame}
          variant="contained"
          sx={{
            width: { xs: 300, sm: 400 },
            height: 60,
            marginBottom: 3,
          }}
        >
          Create game
        </Button>
        <Grid
          container
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
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleJoinGame();
                }
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
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          width: { xs: 300, sm: 'auto' },
          flexDirection: 'column',
        }}
      >
        <Typography>
          🇫🇷 Only French dictionary is currently available
        </Typography>
        <Typography>🇬🇧 English dictionary is coming soon...</Typography>
      </Box>
      <HowToPlay />
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent={'space-between'}
        sx={{
          width: { xs: 200, sm: 300 },
          mt: 2,
        }}
      >
        <Button size="small" href={'mailto:fictionary.io@gmail.com'}>
          Contact
        </Button>
        <Button size="small" onClick={() => setOpenCredits(true)}>
          Credits
        </Button>
      </Grid>
      <CreditsDialog open={openCredits} setOpen={setOpenCredits} />
    </Grid>
  );
};

export default Home;
