import React, { createContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Room from './components/Room';
import { io, Socket } from 'socket.io-client';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme, palette } from './theme';
import { Grid } from '@mui/material';
import Div100vh from 'react-div-100vh';

export const SocketContext = createContext(null);

declare module 'socket.io-client' {
  interface Socket {
    userId: string;
  }
}

const App = () => {
  const [socket, setSocket] = useState<Socket>(null);
  const theme = getTheme();

  useEffect(() => {
    const server =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3020'
        : 'https://sea-lion-app-w7b99.ondigitalocean.app/';
    const socket = io(server, { autoConnect: false });
    const sessionId = localStorage.getItem('fictionarySessionId');
    socket.auth = { sessionId };
    socket.connect();
    socket.on('session', ({ sessionId, userId }) => {
      socket.auth = { sessionId };
      localStorage.setItem('fictionarySessionId', sessionId);
      socket.userId = userId;
    });
    socket.on('connect', () => {
      console.log('connected');
      setSocket(socket);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Div100vh
      style={{
        background: palette.yellow.main,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'start',
        justifyContent: 'center',
        width: '100vw',
      }}
    >
      <Grid container height={1} width={1} sx={{ padding: 3, maxWidth: 700 }}>
        <SocketContext.Provider value={socket}>
          <ThemeProvider theme={theme}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/room/:roomId" element={<Room />} />
            </Routes>
          </ThemeProvider>
        </SocketContext.Provider>
      </Grid>
    </Div100vh>
  );
};

export default App;
