import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { gameHandler } from '../handler/gameHandler';
import { roomHandler } from '../handler/playerHandler';
import { InMemorySessionStore } from './sessionStore';
import { InMemoryGameStore } from '../game/gameStore';
import { PING_INTERVAL, PING_TIMEOUT } from './constants';
import mixpanel from '../mixpanel';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from './types';

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
  const sessionStore = new InMemorySessionStore();
  const gameStore = new InMemoryGameStore(io);

  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    const ip = socket.conn.remoteAddress;
    // find existing session
    if (userId) {
      const session = sessionStore.findSession(userId);
      if (session) {
        socket.data.session = session;
        sessionStore.deleteSession(userId);
      }
    }
    socket.data.userId = userId;
    socket.data.ip = ip;
    return next();
  });

  io.on('connection', (socket) => {
    console.log(
      `Player connected with id: ${socket.id} and ip ${socket.data?.ip}`
    );
    mixpanel.userConnect(socket.data?.userId, socket.data?.ip);
    if (socket.data?.session) {
      console.log(
        `Player ${socket.id} has a session from room ${socket.data.session.roomId} with username ${socket.data.session.username}`
      );
    }

    roomHandler(io, socket, sessionStore, gameStore);
    gameHandler(io, socket, gameStore);

    socket.on('disconnect', async () => {
      console.log(`${socket.id} disconnected`);
    });
  });
  return io;
};
