import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { gameHandler } from '../game';
import { roomHandler } from '../room';
import { getSocketRoom, onLeavingRoom } from '../room/helpers';

export default (server: HTTPServer) => {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:3021'],
      methods: ['GET', 'POST'],
    },
  });
  io.on('connection', (socket) => {
    console.log(`Player connected with id ${socket.id}`);

    roomHandler(io, socket);
    gameHandler(io, socket);

    socket.on('disconnecting', async () => {
      const roomId = getSocketRoom(socket);
      console.log(`${socket.id} disconnecting from room ${roomId}`);
      if (roomId) {
        const playersLeft = await onLeavingRoom(io, socket, roomId);
        io.to(roomId).emit('players', playersLeft);
      }
    });

    socket.on('disconnect', async () => {
      console.log(`${socket.id} disconnected`);
    });
  });
  return io;
};
