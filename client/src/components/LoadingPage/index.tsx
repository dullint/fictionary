import { Button, CircularProgress, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONNECT_TIMEOUT, timeoutMessage } from './constants';

interface PropsType {
  roomErrorMessage: string | null;
}
const LoadingPage = (props: PropsType) => {
  const { roomErrorMessage } = props;
  const [timeoutError, setTimeoutError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setTimeoutError(true), CONNECT_TIMEOUT);
  });

  const errorMessage = timeoutError ? timeoutMessage : roomErrorMessage;

  return (
    <Grid container alignItems="center" justifyContent="center" height="100%">
      {errorMessage ? (
        <Grid
          flexDirection={'column'}
          justifyContent="center"
          alignItems={'center'}
          container
        >
          <Typography variant="subtitle1" align={'center'}>
            {errorMessage}
          </Typography>
          <Button
            onClick={() => navigate('/')}
            variant="contained"
            size="large"
            sx={{ m: 2 }}
          >
            Go to Home page
          </Button>
        </Grid>
      ) : (
        <CircularProgress />
      )}
    </Grid>
  );
};

export default LoadingPage;
