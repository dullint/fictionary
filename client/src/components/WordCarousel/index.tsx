import { Grid, Typography } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { RoomContext } from '../Room';
import { Box } from '@mui/system';
import GameHeader from '../GameHeader';
import {
  getEntriesWithUserIdToDisplay,
  getNumberOfDefinitionToDisplay,
} from '../DefinitionList/helpers';
import socket from '../../socket';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { useParams } from 'react-router-dom';
import DefinitionRender from '../DefinitionRender';
import loupeImg from '../../img/loupe.png';

const WordCarousel = () => {
  const { gameState, gameSettings } = useContext(RoomContext);
  const [swiper, setSwiperInstance] = useState(null);

  const isUsingExample = gameSettings.useExample;
  const definitionsRef = useRef([]);
  const { inputEntries, entry } = gameState;
  const { roomId } = useParams();
  const definitionsNumber = getNumberOfDefinitionToDisplay(gameState);
  const inputEntriesToDisplay = getEntriesWithUserIdToDisplay(
    inputEntries,
    entry,
    roomId
  );

  useEffect(() => {
    definitionsRef.current = definitionsRef.current.slice(0, definitionsNumber);
  }, [definitionsNumber]);

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
          onSwiper={setSwiperInstance}
        >
          {inputEntriesToDisplay.map(([userId, inputEntry]) => (
            <SwiperSlide>
              {({ isActive }) => (
                <Box
                  display={'flex'}
                  height={1}
                  flexDirection={'column'}
                  sx={{ alignItems: 'start', justifyContent: 'center' }}
                >
                  <DefinitionRender
                    entry={{
                      ...entry,
                      definition: inputEntry.definition,
                      example: isUsingExample ? inputEntry.example : '',
                    }}
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
