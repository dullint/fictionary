import { Grid, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { RoomContext } from '../Room';
import { Box } from '@mui/system';
import GameHeader from '../GameHeader';
import { getEntriesWithUserIdToDisplay } from '../DefinitionList/helpers';
import socket from '../../socket';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import { useParams } from 'react-router-dom';
import DefinitionRender from '../DefinitionRender';
import loupeImg from '../../img/loupe.png';
import SwiperCore from 'swiper';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { getDefinitionDisplayDelay } from './helpers';

const WordCarousel = () => {
  const { gameState, gameSettings } = useContext(RoomContext);
  const [swiper, setSwiper] = useState<SwiperCore>();

  const isUsingExample = gameSettings.useExample;
  const { inputEntries, entry } = gameState;
  const { roomId } = useParams();
  const inputEntriesToDisplay = getEntriesWithUserIdToDisplay(
    inputEntries,
    entry,
    roomId
  );

  useEffect(() => {
    if (swiper) {
      socket.on('show_next_def', () => {
        swiper.slideNext();
      });
    }
  }, [swiper]);

  return (
    <Grid container flexDirection="column" height={1} width={1}>
      <GameHeader />
      <Box
        display={'flex'}
        sx={{
          flex: 1,
        }}
        height={'100px'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Swiper
          direction="vertical"
          style={{ height: '100%' }}
          observer={true}
          onSwiper={(swiper) => {
            setSwiper(swiper);
          }}
          onDestroy={() => {
            socket.off('show_next_def');
          }}
          allowTouchMove={false}
        >
          {inputEntriesToDisplay.map(([_, inputEntry]) => (
            <SwiperSlide>
              {({ isActive }) => (
                <Box
                  display={'flex'}
                  height={1}
                  flexDirection={'column'}
                  sx={{ alignItems: 'center', justifyContent: 'center' }}
                >
                  <DefinitionRender
                    entry={{
                      ...entry,
                      definition: inputEntry.definition,
                      example: isUsingExample ? inputEntry.example : '',
                    }}
                  />
                  <Box margin={1}></Box>
                  <CountdownCircleTimer
                    isPlaying={isActive}
                    duration={
                      getDefinitionDisplayDelay(inputEntry.definition) / 1000
                    }
                    size={30}
                    strokeWidth={5}
                    colors={'#D89A9E'}
                  />
                </Box>
              )}
            </SwiperSlide>
          ))}
          <SwiperSlide>
            <Box
              sx={{
                display: 'flex',
                height: 1,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <img src={loupeImg} alt={'test'} />
              <Typography fontSize={25} textAlign={'center'} fontWeight={600}>
                Now Guess the right definition!
              </Typography>
            </Box>
          </SwiperSlide>
        </Swiper>
      </Box>
    </Grid>
  );
};

export default WordCarousel;
