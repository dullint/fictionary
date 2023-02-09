import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { gameHandler } from '../handler/gameHandler';
import { playerHandler } from '../handler/playerHandler';
import { GameStore } from '../game/gameStore';
import { PING_INTERVAL, PING_TIMEOUT } from './constants';
import mixpanel from '../mixpanel';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from './types';
import { roomHandler } from '../handler/roomHandler';

export default (server: HTTPServer) => {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, SocketData>(
    server,
    {
      cors: {
        origin: ['http://localhost:3021', 'http://192.168.1.24:3021'],
        methods: ['GET', 'POST'],
      },
      pingInterval: PING_INTERVAL,
      pingTimeout: PING_TIMEOUT,
    }
  );
  const gameStore = new GameStore(io);

  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    const ip = socket.conn.remoteAddress;
    socket.data.userId = userId;
    socket.data.ip = ip;
    return next();
  });

  io.on('connection', (socket) => {
    console.log(
      `User of id ${socket.data.userId} connected with socket of id: ${socket.id}`
    );
    mixpanel.userConnect(socket.data.userId, socket.data.ip);

    roomHandler(io, socket, gameStore);
    playerHandler(io, socket, gameStore);
    gameHandler(io, socket, gameStore);

    socket.on('disconnect', async () => {
      console.log(`User of id ${socket.data.userId} disconnected`);
    });
  });
  return io;
};
