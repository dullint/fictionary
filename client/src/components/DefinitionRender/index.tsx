import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { DictionnaryEntry } from '../../../../server/dictionary/types';
import { getNatureGenre } from './helpers';

interface PropsType {
  entry: DictionnaryEntry;
}

const DefinitionRender = (props: PropsType) => {
  const { word, definition, nature, genre, example } = props.entry;
  return (
    <Box>
      <Typography
        component="span"
        fontFamily="bespoke-extrabold-italic"
        sx={{ marginRight: 0.5 }}
        fontSize={17}
      >
        {word}
      </Typography>
      <Typography
        component="span"
        fontStyle={'italic'}
        fontSize={15}
        fontFamily="bespoke-light-italic"
        sx={{ marginRight: 1 }}
      >
        {getNatureGenre(nature, genre)}
      </Typography>
      <Typography
        component="span"
        fontSize={15}
        textOverflow="ellipsis"
        overflow={'hidden'}
        variant="body1"
        sx={{ marginRight: 0.5 }}
      >
        {definition}
      </Typography>

      <Typography
        component="span"
        fontStyle={'italic'}
        fontSize={16}
        fontWeight={900}
        fontFamily="bespoke-medium"
        sx={{ marginRight: 0.5 }}
      >
        {example ? 'Ex.' : ''}
      </Typography>
      <Typography component="span" fontSize={15} sx={{ marginRight: 1 }}>
        {example}
      </Typography>
    </Box>
  );
};

export default DefinitionRender;
