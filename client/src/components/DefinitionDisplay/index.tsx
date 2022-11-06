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
    <Typography sx={{ m: 1 }}>
      <Box
        component="span"
        fontWeight={900}
        fontSize={20}
        sx={{ marginRight: 0.5 }}
      >
        {word}
      </Box>
      <Box
        component="span"
        fontStyle={'italic'}
        fontWeight={100}
        sx={{ marginRight: 1 }}
      >
        {type}
      </Box>
      <Box component="span">{definition}</Box>
    </Typography>
  );
};

export default DefinitionDisplay;
