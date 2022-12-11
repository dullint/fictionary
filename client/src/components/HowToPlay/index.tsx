import { IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { TypeAnimation } from 'react-type-animation';
import { theme } from '../../theme';
import DefinitionRender from '../DefinitionRender';
import FindReplaceIcon from '@mui/icons-material/FindReplace';
import { WordGenre, WordNature } from '../DefinitionRender/helpers';

const cardSx = {
  border: '1px solid black',
  borderRadius: 2.5,
  height: '160px',
  padding: 2,
  mx: 3,
};

const HowToPlay = () => {
  return (
    <Box>
      <Typography variant="h6" sx={{ marginBottom: 1, marginLeft: 3 }}>
        How to play ?
      </Typography>
      <Carousel
        autoPlay={false}
        animation="slide"
        duration={500}
        interval={6000}
        sx={{
          width: { xs: '348px', sm: '400px' },
        }}
      >
        {[
          <Box
            sx={cardSx}
            display="flex"
            flexDirection="column"
            justifyContent={'space-between'}
          >
            <Box>
              <Typography variant="subtitle2" color={theme.palette.green.dark}>
                You are given a rare word.
              </Typography>
              <Typography
                variant="subtitle2"
                marginBottom={1}
                color={theme.palette.green.dark}
              >
                Invent a definition for it!
              </Typography>
              <Box sx={{ minHeight: 50 }}>
                <Typography
                  component="span"
                  fontFamily="bespoke-extrabold-italic"
                  sx={{ marginRight: 0.5 }}
                  fontSize={15}
                >
                  pétrichor
                </Typography>
                <Typography
                  component="span"
                  fontStyle={'italic'}
                  fontSize={14}
                  fontFamily="bespoke-light-italic"
                  sx={{ marginRight: 0.5 }}
                >
                  {'n.m '}
                </Typography>
                <TypeAnimation
                  sequence={[
                    'Lance à trident utilisé par les gladiateurs',
                    1000,
                    '',
                    0,
                  ]}
                  wrapper="span"
                  cursor={true}
                  repeat={Infinity}
                  deletionSpeed={80}
                  speed={60}
                  style={{
                    fontSize: 15,
                    fontFamily: 'bespoke-regular',
                  }}
                />
              </Box>
            </Box>
          </Box>,
          <Box
            sx={cardSx}
            display="flex"
            flexDirection="column"
            justifyContent={'space-between'}
          >
            <Box>
              <Typography
                marginBottom={1}
                variant="subtitle2"
                sx={{ marginBottom: 1 }}
              >
                Enter an example to put in situation the word with your invented
                definition
              </Typography>
              <DefinitionRender
                entry={{
                  word: 'pétrichor',
                  example: '',
                  nature: WordNature.NOUN,
                  genre: WordGenre.MAS,
                  definition: 'Lance à trident utilisé par les gladiateurs',
                }}
                small
              />
              <Box sx={{ minHeight: 50 }}>
                <Typography
                  component="span"
                  fontFamily="bespoke-extrabold-italic"
                  sx={{ marginRight: 0.5 }}
                  fontSize={14}
                >
                  Ex.
                </Typography>
                <TypeAnimation
                  sequence={[
                    'le pétrichor traversa le bouclier à plusieurs reprises',
                    1000,
                    '',
                    0,
                  ]}
                  wrapper="span"
                  cursor={true}
                  repeat={Infinity}
                  deletionSpeed={80}
                  speed={60}
                  style={{
                    fontSize: 14,
                    fontFamily: 'bespoke-regular',
                  }}
                />
              </Box>
            </Box>
            <Box></Box>
          </Box>,
          <Box sx={cardSx}>
            <Typography variant="subtitle2">
              Then, you are anonymously given all definitions. The ones of other
              players and the true one.
            </Typography>
            <Typography marginBottom={1} variant="subtitle2">
              Guess the true one!
            </Typography>
          </Box>,
          <Box sx={cardSx}>
            <Typography variant="subtitle2">
              You earn points if you find the true definition or if players vote
              for your definition.
            </Typography>
            <Typography variant="subtitle2">
              Get the most points to be the winner!
            </Typography>
          </Box>,
        ]}
      </Carousel>
    </Box>
  );
};

export default HowToPlay;
