import React, { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { SocketContext } from '../../App';
import { useParams } from 'react-router';
import { updateUsername } from '../../services/room';

export interface Propstype {
  open: boolean;
  setOpen: (bool: boolean) => void;
}

const UsernameDialog = (props: Propstype) => {
  const { open, setOpen } = props;
  const socket = useContext(SocketContext);
  const { roomId } = useParams();
  const [username, setUsername] = useState<string>(null);

  const handleClose = () => {
    setOpen(false);
  };

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
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Username</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter you username</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Username"
          type="text"
          fullWidth
          variant="standard"
          onChange={handleTextFieldChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UsernameDialog;
