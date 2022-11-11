import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { roomHandler } from './room';
import { gameHandler } from './game';
import {
  getPlayers,
  getSocketRoom,
  onLeavingRoom,
  selectNewAdmin,
} from './room/helpers';
import GAMES from './game/games';
import path from 'path';

const app = express();
app.use(cors());
if (process.env.NODE_ENV !== 'development') {
  app.use(express.static(path.resolve(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}
const server = http.createServer(app);
const port = process.env.PORT || 3020;

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3021',
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

server.listen(port, () => console.log(`SERVER IS RUNNING ON PORT ${port}`));
