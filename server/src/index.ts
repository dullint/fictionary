import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { roomHandler } from './room';
import { gameHandler } from './game';
const app = express();

app.use(cors());

const server = http.createServer(app);
const port = 3021;

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3020'],
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`Player Connected with id ${socket.id}`);

  roomHandler(io, socket);
  gameHandler(io, socket);

  socket.on('disconnect', async () => {
    console.log(`${socket.id} disconnected`);
  });
});

server.listen(port, () => console.log('SERVER IS RUNNING'));
