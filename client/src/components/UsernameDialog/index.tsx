import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Grid, Input, Typography } from '@mui/material';
import { palette, theme } from '../../theme';
import { Box } from '@mui/system';
import { ServerResponse } from '../../../../server/src/socket/types';
import socket from '../../socket';

export interface Propstype {
  open: boolean;
  setOpen: (bool: boolean) => void;
}

const UsernameDialog = (props: Propstype) => {
  const { open, setOpen } = props;
  const [username, setUsername] = useState<string>(null);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState(null);

  const handleTextFieldChange = (event) => {
    setUsername(event.target.value);
    setUsernameErrorMessage(null);
  };

  const handleSubmit = async () => {
    const callback = (response: ServerResponse) => {
      const { error, success } = response;
      if (success) setOpen(false);
      else setUsernameErrorMessage(error);
    };
    socket.emit('update_username', username, callback);
  };

  const handlePressKey = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        sx={{
          backgroundColor: theme.palette.yellow.main,
          border: '4px solid black',
        }}
      >
        <Grid
          container
          direction="column"
          alignItems={'center'}
          justifyContent="center"
        >
          <Box justifyContent={'left'} width={1}>
            <Typography variant="h6" sx={{ marginBottom: 1 }} align="left">
              Choose your username:
            </Typography>
          </Box>
          <Input
            onKeyPress={handlePressKey}
            autoFocus
            fullWidth
            onChange={handleTextFieldChange}
            inputProps={{
              maxLength: 15,
              style: {
                fontSize: 30,
                textAlign: 'center',
                fontWeight: 900,
                fontFamily: 'bespoke-medium',
              },
            }}
            sx={{ height: 60 }}
          />
          {usernameErrorMessage && (
            <Typography sx={{ color: palette.secondary.main }}>
              {usernameErrorMessage}
            </Typography>
          )}
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ width: 100, marginTop: 2 }}
          >
            OK
          </Button>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default UsernameDialog;
