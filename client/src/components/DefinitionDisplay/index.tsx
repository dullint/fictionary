import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { DictionnaryEntry } from '../../../../server/dictionary/types';

interface PropsType {
  entry: DictionnaryEntry;
}

const DefinitionDisplay = (props: PropsType) => {
  const { word, definition, nature, genre } = props.entry;
  return (
    <Box>
      <Typography
        component="span"
        variant="h6"
        sx={{ marginRight: 0.5 }}
        fontSize={18}
      >
        {word}
      </Typography>
      <Typography
        component="span"
        fontStyle={'italic'}
        fontSize={18}
        fontFamily="bespoke-light-italic"
        sx={{ marginRight: 0.5 }}
      >
        {nature}
      </Typography>
      <Typography
        component="span"
        fontStyle={'italic'}
        fontSize={18}
        fontFamily="bespoke-light-italic"
        sx={{ marginRight: 0.5 }}
      >
        {genre}.
      </Typography>
      <Typography
        component="span"
        fontSize={18}
        textOverflow="ellipsis"
        overflow={'hidden'}
        variant="body1"
      >
        {definition}
      </Typography>
    </Box>
  );
};

export default DefinitionDisplay;
