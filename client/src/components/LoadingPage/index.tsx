import { Button, CircularProgress, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CONNECT_TIMEOUT } from './constants';

interface PropsType {
  joinErrorMessage: string;
}
const LoadingPage = (props: PropsType) => {
  const { joinErrorMessage } = props;
  const [errorMessage, setErrorMessage] = useState(joinErrorMessage);
  const navigate = useNavigate();
  const { roomId } = useParams();
  useEffect(() => {
    if (joinErrorMessage === 'Room do not exist') {
      setErrorMessage(`The room ${roomId} does not exist`);
    }
    const timeoutMessage = `There was an error while trying to connect to the room ${roomId}.`;
    setTimeout(() => setErrorMessage(timeoutMessage), CONNECT_TIMEOUT);
  }, [joinErrorMessage, roomId]);
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
            {errorMessage.concat('\nPlease go back to the Home page.')}
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
