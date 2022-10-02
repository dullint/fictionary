import { Server, Socket } from 'socket.io';
import { getSocketRoom } from '../room/helpers';
import { dictionnary } from './dictionnary';
import GAMES, { Game } from './games';

export const get_random_word = () =>
  dictionnary[Math.floor(Math.random() * dictionnary.length)];

export const getGame = (socket: Socket) => {
  const roomId = getSocketRoom(socket);
  return GAMES.get(roomId);
};

export const updateGame = (io: Server, socket: Socket, game: Game) => {
  const roomId = getSocketRoom(socket);
  io.to(roomId).emit('game', game);
  console.log(`Game of room ${roomId} updated`);
};
