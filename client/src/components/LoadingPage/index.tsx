import { Button, CircularProgress, Grid, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PropsType {
  error: string;
}
const LoadingPage = (props: PropsType) => {
  const { error } = props;
  const navigate = useNavigate();

  return (
    <Grid container alignItems="center" justifyContent="center" height="100%">
      {error ? (
        <Grid
          flexDirection={'column'}
          justifyContent="center"
          alignItems={'center'}
          container
        >
          <Typography variant="subtitle1" align={'center'}>
            {error}
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
