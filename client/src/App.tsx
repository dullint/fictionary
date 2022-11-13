import React, { createContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Room from './components/Room';
import { io, Socket } from 'socket.io-client';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme, palette } from './theme';
import { Grid } from '@mui/material';

export const SocketContext = createContext(null);

const App = () => {
  const [socket, setSocket] = useState<Socket>(null);
  const theme = getTheme();

  useEffect(() => {
    const server =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3020'
        : 'https://sea-lion-app-w7b99.ondigitalocean.app/';
    const socket = io(server);
    setSocket(socket);
    return () => {
      socket.disconnect();
    };
  }, []);
  const documentHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty('--doc-height', `${window.innerHeight}px`);
  };
  window.addEventListener('resize', documentHeight);
  documentHeight();

  return (
    <Grid
      container
      alignItems="start"
      justifyContent="center"
      margin={0}
      width={'100vw'}
      height={'var(--doc-height)'}
      sx={{
        background: palette.yellow.main,
      }}
      overflow={'hidden'}
    >
      <Grid
        container
        height={1}
        width={1}
        sx={{ padding: 3, maxWidth: 700, maxHeight: 600 }}
      >
        <SocketContext.Provider value={socket}>
          <ThemeProvider theme={theme}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/room/:roomId" element={<Room />} />
            </Routes>
          </ThemeProvider>
        </SocketContext.Provider>
      </Grid>
    </Grid>
  );
};

export default App;
