import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { gameHandler } from '../game';
import { roomHandler } from '../room';
import { InMemorySessionStore } from './sessionStore';
import { InMemoryGameStore } from './gameStore';
import { PING_INTERVAL, PING_TIMEOUT } from './constants';
import mixpanel from '../mixpanel';

export default (server: HTTPServer) => {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:3021', 'http://localhost:3020'],
      methods: ['GET', 'POST'],
    },
    pingInterval: PING_INTERVAL,
    pingTimeout: PING_TIMEOUT,
  });
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
    console.log(`Player connected with id: ${socket.id}`);
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
