import React, { createContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Room from './components/Room';
import CreateRoom from './components/CreateGame';
import { io, Socket } from 'socket.io-client';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme } from './theme';
import { Box, Grid } from '@mui/material';
import { Container } from '@mui/system';

export const SocketContext = createContext(null);

const App = () => {
  const [socket, setSocket] = useState<Socket>(null);
  const theme = getTheme();

  useEffect(() => {
    const server = 'http://localhost:3021';
    const socket = io(server);
    setSocket(socket);

    socket.emit('game');
    socket.emit('player');
  }, []);

  return (
    <Grid
      container
      alignItems="start"
      justifyContent="center"
      margin={0}
      width={1}
      height={'100vh'}
      sx={{
        background: 'radial-gradient(#F5F5F5, #f0f3ff)',
      }}
    >
      <Grid container sx={{ maxWidth: 600, padding: 2 }}>
        <SocketContext.Provider value={socket}>
          <ThemeProvider theme={theme}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/room/create-room" element={<CreateRoom />} />
              <Route path="/room/:roomId" element={<Room />} />
            </Routes>
          </ThemeProvider>
        </SocketContext.Provider>
      </Grid>
    </Grid>
  );
};

export default App;
