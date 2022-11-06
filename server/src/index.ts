import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { roomHandler } from './room';
import { gameHandler } from './game';
import { getPlayers, getSocketRoom } from './room/helpers';
const app = express();

app.use(cors());

const server = http.createServer(app);
const port = process.env.PORT || 3021;

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3020'],
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`Player connected with id ${socket.id}`);

  roomHandler(io, socket);
  gameHandler(io, socket);

  socket.on('disconnecting', async () => {
    const roomId = getSocketRoom(socket);
    console.log({ roomId });
    if (roomId) {
      const players = await getPlayers(io, roomId);
      io.to(roomId).emit(
        'players',
        players.filter((player) => player.socketId != socket.id)
      );
    }
  });
  socket.on('disconnection', async () => {
    console.log(`${socket.id} disconnected`);
  });
});

server.listen(port, () => console.log('SERVER IS RUNNING'));
