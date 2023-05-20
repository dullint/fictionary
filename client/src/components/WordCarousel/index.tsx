import { Grid, Tooltip, Button } from '@mui/material';
import React, { useContext, useEffect, useRef } from 'react';
import { RoomContext } from '../Room';
import { Box } from '@mui/system';
import GameHeader from '../GameHeader';
import { bottomPageButtonSx } from '../../constants/style';
import { getNumberOfDefinitionToDisplay } from '../DefinitionList/helpers';
import socket from '../../socket';
import { getMyPlayer } from '../WaitingRoom/helpers';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

const WordCarousel = () => {
  const { players, gameState } = useContext(RoomContext);

  const isAdmin = getMyPlayer(players)?.isAdmin;
  const definitionsRef = useRef([]);
  const definitionsNumber = getNumberOfDefinitionToDisplay(gameState);

  useEffect(() => {
    definitionsRef.current = definitionsRef.current.slice(0, definitionsNumber);
  }, [definitionsNumber]);

  const handleNextStep = () => {
    socket.emit('show_results');
  };

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
          // showsPagination={false}
          direction="vertical"
          style={{ height: '100%' }}
        >
          <SwiperSlide>Slide 1</SwiperSlide>
          <SwiperSlide>Slide 2</SwiperSlide>
          <SwiperSlide>Slide 3</SwiperSlide>
          <SwiperSlide>Slide 4</SwiperSlide>
          <SwiperSlide>Slide 5</SwiperSlide>
          <SwiperSlide>Slide 6</SwiperSlide>
          <SwiperSlide>Slide 7</SwiperSlide>
          <SwiperSlide>Slide 8</SwiperSlide>
          <SwiperSlide>Slide 9</SwiperSlide>
        </Swiper>
      </Box>
      <Tooltip
        title={isAdmin ? null : 'Waiting for the admin to continue'}
        placement="top"
        sx={{ m: 1 }}
      >
        <Box display="flex" justifyContent={'center'}>
          <Button
            onClick={handleNextStep}
            disabled={!isAdmin}
            variant="contained"
            sx={bottomPageButtonSx}
          >
            See scores
          </Button>
        </Box>
      </Tooltip>
    </Grid>
  );
};

export default WordCarousel;
