import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { gameHandler } from '../game';
import { roomHandler } from '../room';
import { getSocketRoom, onLeavingRoom } from '../room/helpers';
import { randomBytes } from 'crypto';
import { InMemorySessionStore } from './sessionStore';

export default (server: HTTPServer) => {
  const sessionStore = new InMemorySessionStore();
  const randomId = () => randomBytes(8).toString('hex');
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:3021', 'http://localhost:3020'],
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket, next) => {
    const sessionId = socket.handshake.auth.sessionId;
    // find existing session
    if (sessionId) {
      const session = sessionStore.findSession(sessionId);
      if (session) {
        socket.data.sessionId = sessionId;
        socket.data.userId = session.userId;
        socket.data.username = session.username;
        return next();
      }
    }
    // create new session
    socket.data.sessionId = randomId();
    socket.data.userId = randomId();
    next();
  });

  io.on('connection', (socket) => {
    console.log(
      `Player connected ${JSON.stringify({
        socketId: socket.id,
        sessionId: socket.data.sessionId,
        userId: socket.data.userId,
        username: socket.data.username,
      })}`
    );
    sessionStore.saveSession(socket.data.sessionId, {
      userId: socket.data.userId,
      username: socket.data.username,
    });

    socket.emit('session', {
      sessionId: socket.data.sessionId,
      userId: socket.data.userId,
    });

    roomHandler(io, socket, sessionStore);
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
      sessionStore.saveSession(socket.data.sessionID, {
        userId: socket.data.userId,
        username: socket.data.username,
      });
    });
  });
  return io;
};
