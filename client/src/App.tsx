import React, { createContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Room from './components/Room';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme, palette } from './theme';
import { Grid } from '@mui/material';
import Div100vh from 'react-div-100vh';
import socket from './socket';

export const SocketContext = createContext(null);

const App = () => {
  const theme = getTheme();
  const [connectCounter, setConnectCounter] = useState(0);

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on('session', ({ sessionId, userId }) => {
      socket.auth = { sessionId };
      localStorage.setItem('fictionarySessionId', sessionId);
      socket.userId = userId;
    });

    socket.on('connect', () => {
      setConnectCounter((c) => c + 1);
    });
  }, [connectCounter]);

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
