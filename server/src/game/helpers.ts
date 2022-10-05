import { Server, Socket } from 'socket.io';
import { getSocketRoom } from '../room/helpers';
import { dictionnary } from './dictionnary';
import GAMES, { Game } from './games';
import { GameStep } from './types';

export const get_random_entry = () =>
  dictionnary[Math.floor(Math.random() * dictionnary.length)];

export const runTimer = (
  io: Server,
  roomId: string,
  time: number,
  game: Game
) => {
  var counter = time * 60;
  const interval = setInterval(() => {
    io.emit('timer', counter);
    if (counter === 0) {
      clearInterval(interval);
      game.gameStep = GameStep.GUESS;
      io.to(roomId).emit('game', game);
    }
    counter--;
  }, 1000);
};
