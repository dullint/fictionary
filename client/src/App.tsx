import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Room from './components/Room';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme, palette } from './theme';
import { Grid } from '@mui/material';
import Div100vh from 'react-div-100vh';
import socket from './socket';

const App = () => {
  const theme = getTheme();

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Div100vh
      style={{
        background: palette.yellow.main,
        backgroundColor: palette.yellow.main,
        overflow: 'auto',
        display: 'flex',
        alignItems: 'start',
        justifyContent: 'center',
        width: '100vw',
      }}
    >
      <Grid
        container
        width={1}
        height={1}
        sx={{ padding: 2, maxWidth: 700, justifyContent: 'center' }}
      >
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room/:roomId" element={<Room />} />
          </Routes>
        </ThemeProvider>
      </Grid>
    </Div100vh>
  );
};

export default App;
