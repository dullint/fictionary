import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

interface PropsType {
  word: string;
  definition: string;
  type: string;
}

const DefinitionDisplay = (props: PropsType) => {
  const { word, definition, type } = props;
  return (
    <Box>
      <Typography
        component="span"
        fontWeight={900}
        fontSize={20}
        sx={{ marginRight: 0.5 }}
      >
        {word}
      </Typography>
      <Typography
        component="span"
        fontStyle={'italic'}
        fontWeight={100}
        sx={{ marginRight: 1 }}
      >
        {type}
      </Typography>
      <Typography component="span">{definition}</Typography>
    </Box>
  );
};

export default DefinitionDisplay;
