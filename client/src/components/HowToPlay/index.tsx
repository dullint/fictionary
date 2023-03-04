import { Button, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { theme } from '../../theme';
import DefinitionRender from '../DefinitionRender';
import { WordGenre, WordNature } from '../DefinitionRender/helpers';
import FindReplaceIcon from '@mui/icons-material/FindReplace';
import PanToolAltIcon from '@mui/icons-material/PanToolAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import { TypeAnimation } from 'react-type-animation';

const cardSx = {
  border: '1px solid black',
  borderRadius: 2.5,
  height: '160px',
  padding: 2,
  mx: 3,
};

const card1 = (
  <Box
    sx={cardSx}
    display="flex"
    flexDirection="column"
    justifyContent={'space-between'}
  >
    <Box>
      <Typography
        variant="subtitle1"
        color={theme.palette.black.main}
        sx={{ mb: 2, lineHeight: 'normal' }}
      >
        You are given an uncommon or archaic word. Invent a definition for it!
      </Typography>

      <Box sx={{ minHeight: 50 }}>
        <Typography
          component="span"
          fontFamily="bespoke-extrabold-italic"
          sx={{ marginRight: 0.5 }}
          fontSize={19}
        >
          pétrichor
        </Typography>
        <Typography
          component="span"
          fontStyle={'italic'}
          fontFamily="bespoke-light-italic"
          sx={{ marginRight: 0.5 }}
          fontSize={18}
        >
          {'n.m '}
        </Typography>
        <TypeAnimation
          sequence={['invent a definition...', 8000, '']}
          cursor={true}
          wrapper="span"
          repeat={Infinity}
          deletionSpeed={30}
          speed={30}
          style={{
            fontSize: 17,
            fontFamily: 'bespoke-regular',
          }}
        />
      </Box>
    </Box>
  </Box>
);

const card2 = (
  <Box sx={cardSx} display="flex" flexDirection="column">
    <Typography
      marginBottom={1}
      variant="subtitle1"
      sx={{ marginBottom: 2, lineHeight: 'normal' }}
    >
      If one of the players knows the word, the game admin can change it
    </Typography>
    <Box display={'flex'} alignItems="center" justifyContent={'center'}>
      <IconButton
        sx={{
          border: `2px solid ${theme.palette.primary.main}`,
          width: 60,
          height: 60,
          borderRadius: 4,
          color: theme.palette.primary.main,
        }}
      >
        <FindReplaceIcon fontSize="large" />
      </IconButton>
      <PanToolAltIcon
        sx={{
          transform: 'rotate(-40deg)',
          translate: '-25px 15px',
          fontSize: 60,
        }}
      />
    </Box>
  </Box>
);

const card3 = (
  <Box sx={cardSx}>
    <Typography variant="subtitle1" sx={{ mb: 1, lineHeight: 'normal' }}>
      You are then anonymously given all players definitions and the true one.
      Guess the true one!
    </Typography>
    <DefinitionRender
      entry={{
        word: 'pétrichor',
        example: '',
        nature: WordNature.NOUN,
        genre: WordGenre.MAS,
        definition: 'celebration of...',
      }}
      small
    />
    <DefinitionRender
      entry={{
        word: 'pétrichor',
        example: '',
        nature: WordNature.NOUN,
        genre: WordGenre.MAS,
        definition: 'old martial art...',
      }}
      small
    />
    <DefinitionRender
      entry={{
        word: 'pétrichor',
        example: '',
        nature: WordNature.NOUN,
        genre: WordGenre.MAS,
        definition: 'rat species that...',
      }}
      small
    />
  </Box>
);

const card4 = (
  <Box sx={cardSx}>
    <Typography variant="h6" sx={{ mb: 1 }} fontSize={16}>
      Earn point by:
    </Typography>
    <Typography variant="subtitle2" fontSize={16}>
      - finding the true definition
    </Typography>
    <Typography variant="subtitle2" fontSize={16}>
      - fooling players to vote for your definition
    </Typography>
    <Typography textAlign={'end'} variant="h5" sx={{ mr: 1 }}>
      +1 point each
    </Typography>
  </Box>
);

const card5 = (
  <Box sx={cardSx}>
    <Typography variant="subtitle1" sx={{ mb: 2 }}>
      When creating a room, take a look at game settings to see game variants!
    </Typography>

    <Box display={'flex'} alignItems="center" justifyContent={'center'}>
      <Button
        color="primary"
        variant="outlined"
        endIcon={<SettingsIcon />}
        disableRipple
      >
        Game settings
      </Button>
    </Box>
  </Box>
);

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
        {[card1, card2, card3, card4, card5]}
      </Carousel>
    </Box>
  );
};

export default HowToPlay;
