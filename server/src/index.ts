import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { roomHandler } from './room';
import { gameHandler } from './game';
import { getPlayers, getSocketRoom, selectNewAdmin } from './room/helpers';
import GAMES from './game/games';
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
    if (roomId) {
      const playersLeft = (await getPlayers(io, roomId)).filter(
        (player) => player.socketId != socket.id
      );
      if (playersLeft.length === 0) GAMES.delete(roomId);
      if (socket.data?.isAdmin && playersLeft.length > 0) {
        selectNewAdmin(io, socket.id, roomId);
      }
      io.to(roomId).emit('players', playersLeft);
    }
  });
  socket.on('disconnection', async () => {
    console.log(`${socket.id} disconnected`);
  });
});

server.listen(port, () => console.log('SERVER IS RUNNING'));
