import React, { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { SocketContext } from '../../App';
import { useParams } from 'react-router';
import { updateUsername } from '../../services/room';
import { Grid, Typography } from '@mui/material';

export interface Propstype {
  open: boolean;
  setOpen: (bool: boolean) => void;
}

const UsernameDialog = (props: Propstype) => {
  const { open, setOpen } = props;
  const socket = useContext(SocketContext);
  const { roomId } = useParams();
  const [username, setUsername] = useState<string>(null);

  const handleTextFieldChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSubmit = async () => {
    if (username) {
      const set = await updateUsername(socket, roomId, username).catch(
        (err) => {
          alert(err.message);
        }
      );
      if (set) setOpen(false);
    } else {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <Grid
          container
          direction="column"
          alignItems={'center'}
          justifyContent="center"
        >
          <Typography variant="h5" sx={{ m: 1 }}>
            Choose your username
          </Typography>
          <TextField
            hiddenLabel
            autoFocus
            variant="outlined"
            onChange={handleTextFieldChange}
            inputProps={{
              maxLength: 15,
              style: { fontSize: 20, fontWeight: 900 },
            }}
            sx={{ m: 2, width: 270 }}
          />
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ width: 100 }}
          >
            OK
          </Button>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default UsernameDialog;
