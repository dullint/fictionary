import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import DefinitionRender from '../DefinitionRender';
import { WordGenre, WordNature } from '../DefinitionRender/helpers';
import { TypeAnimation } from 'react-type-animation';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper';
import './styles.css';

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
      <Typography variant="subtitle1" sx={{ mb: 2, lineHeight: 'normal' }}>
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

const card3 = (
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

const HowToPlay = () => {
  return (
    <Box>
      <Typography variant="h6" sx={{ marginBottom: 1, marginLeft: 3 }}>
        How to play ?
      </Typography>
      <Swiper
        modules={[Pagination]}
        style={{
          width: '350px',
        }}
        className="mySwiper"
        pagination={true}
        loop={true}
      >
        <SwiperSlide>{card1}</SwiperSlide>
        <SwiperSlide>{card2}</SwiperSlide>
        <SwiperSlide>{card3}</SwiperSlide>
      </Swiper>
    </Box>
  );
};

export default HowToPlay;
