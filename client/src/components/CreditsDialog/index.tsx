import { Box, Dialog, DialogContent, Link, Typography } from '@mui/material';
import React from 'react';
import { theme } from '../../theme';

export interface PropsType {
  open: boolean;
  setOpen: (bool: boolean) => void;
}

const CreditsDialog = (props: PropsType) => {
  const { open, setOpen } = props;
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        border: '4px solid black',
      }}
    >
      <DialogContent
        sx={{
          backgroundColor: theme.palette.yellow.main,
          border: '4px solid black',
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Credits
        </Typography>
        <Typography variant="subtitle1">Avatars:</Typography>
        <Typography>
          <Link
            href="https://www.figma.com/community/file/966199982810283152"
            sx={{ marginRight: 0.5 }}
            target="_blank"
            alignSelf="center"
            component={'span'}
          >
            Croodles - Doodle your face
          </Link>
          <Typography sx={{ marginRight: 0.5 }} component={'span'}>
            by
          </Typography>
          <Link
            href="https://vijayverma.co/"
            sx={{ marginRight: 0.5 }}
            target="_blank"
            alignSelf="center"
            component={'span'}
          >
            vijay verma
          </Link>
          <Typography sx={{ marginRight: 0.5 }} component={'span'}>
            licensed under
          </Typography>
          <Link
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            alignSelf="center"
            component={'span'}
          >
            CC BY 4.0
          </Link>
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default CreditsDialog;
