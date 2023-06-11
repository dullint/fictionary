import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext } from 'react';
import { DictionnaryEntry } from '../../../../server/src/dictionary/types';
import { RoomContext } from '../Room';
import { cleanSentence } from '../WordPrompt/helpers';
import { DictionaryLanguage, getNatureGenre } from './helpers';

interface PropsType {
  entry: DictionnaryEntry;
  small?: boolean;
}

const DefinitionRender = (props: PropsType) => {
  const { word, definition, nature, genre, example } = props.entry;
  const language =
    useContext(RoomContext)?.gameSettings.language ??
    DictionaryLanguage.English;
  return (
    <Box>
      <Typography
        component="span"
        fontFamily="bespoke-extrabold-italic"
        sx={{ marginRight: 0.5 }}
        fontSize={props.small ? 14 : 17}
      >
        {word}
      </Typography>
      <Typography
        component="span"
        fontStyle={'italic'}
        fontSize={props.small ? 13 : 15}
        fontFamily="bespoke-light-italic"
        sx={{ marginRight: 0.5 }}
      >
        {getNatureGenre(nature, genre, language)}
      </Typography>
      <Typography
        component="span"
        fontSize={props.small ? 13 : 15}
        textOverflow="ellipsis"
        overflow={'hidden'}
        variant="body1"
        sx={{ marginRight: 0.5 }}
      >
        {cleanSentence(definition)}
      </Typography>
      <Typography
        component="span"
        fontStyle={'italic'}
        fontSize={props.small ? 14 : 16}
        fontWeight={900}
        fontFamily="bespoke-medium"
        sx={{ marginRight: example ? 0.5 : 0 }}
      >
        {example ? 'Ex.' : ''}
      </Typography>
      <Typography
        component="span"
        fontSize={props.small ? 13 : 15}
        sx={{ marginRight: example ? 0.5 : 0 }}
      >
        {cleanSentence(example)}
      </Typography>
    </Box>
  );
};

export default DefinitionRender;
