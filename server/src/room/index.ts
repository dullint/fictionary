import { Socket, Server } from 'socket.io';
import { UpdateUsernamePayload, CreateRoomPayload } from './types';
import {
  applySessionSaved,
  canJoinRoom,
  checkIfRoomExists,
  checkIfUsernameTaken,
  getConnectedPlayers,
  getSocketRoom,
  onLeavingRoom,
  selectColor,
} from './helpers';
import { InMemorySessionStore } from '../socket/sessionStore';
import { InMemoryGameStore } from '../socket/gameStore';
import { SESSION_DELETE_DELAY } from '../socket/constants';

export const roomHandler = (
  io: Server,
  socket: Socket,
  sessionStore: InMemorySessionStore,
  gameStore: InMemoryGameStore
) => {
  const updateConnectedPlayers = async (roomId: string) => {
    const players = await getConnectedPlayers(io, roomId);
    io.to(roomId).emit('connectedPlayers', players);
  };

  const queryConnectedPlayers = async () => {
    const roomId = getSocketRoom(socket);
    const players = await getConnectedPlayers(io, roomId);
    if (players.length === 0) gameStore.deleteGame(roomId);
    io.to(roomId).emit('connectedPlayers', players);
  };

  const joinRoom = async ({ roomId }: { roomId: string }) => {
    if (Array.from(socket.rooms.values()).includes(roomId)) {
      socket.emit('room_joined');
      return;
    }
    const [canJoin, errorMessage] = await canJoinRoom(
      io,
      socket,
      roomId,
      gameStore
    );
    if (!canJoin) {
      socket.emit('join_room_error', {
        message: errorMessage,
      });
    }

    if (socket.data?.session && socket.data?.session?.roomId === roomId) {
      applySessionSaved(socket);
    }

    const otherRoomPlayers = await getConnectedPlayers(io, roomId);
    await socket.join(roomId);
    socket.emit('room_joined');
    console.log(`User ${socket.id} joined room ${roomId}`);

    socket.data.color = socket?.data?.color ?? selectColor(otherRoomPlayers);

    updateConnectedPlayers(roomId);
  };

  const createRoom = async ({ roomId, gameSettings }: CreateRoomPayload) => {
    await socket.join(roomId);
    socket.emit('room_created');
    console.log(`User ${socket.id} created room ${roomId}`);

    gameStore.createGame(roomId, gameSettings, socket);

    const roomPlayers = await getConnectedPlayers(io, roomId);
    socket.data.color = selectColor(roomPlayers);
    socket.data.isAdmin = true;

    updateConnectedPlayers(roomId);
    io.to(roomId).emit('game', gameStore.getGame(roomId)?.info());
  };

  const updateUsername = async ({
    roomId,
    username,
  }: UpdateUsernamePayload) => {
    if (!username) {
      socket.emit('update_username_error', {
        message: 'You must choose a username',
      });
      return;
    }
    if (await checkIfUsernameTaken(io, roomId, username)) {
      socket.emit('update_username_error', {
        message: 'Username already taken',
      });
      return;
    }
    socket.data.username = username;
    socket.emit('username_updated');
    updateConnectedPlayers(roomId);
  };

  const leaveRoom = async ({ roomId }: { roomId: string }) => {
    await onLeavingRoom(io, socket, roomId, gameStore);
    socket.data.isAdmin = false;
    delete socket.data.username;
    delete socket.data.color;
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
    updateConnectedPlayers(roomId);
  };

  const leaveRoomOnDisconnection = async () => {
    const roomId = getSocketRoom(socket);
    if (roomId) {
      sessionStore.saveSession(socket.data.userId, {
        username: socket.data?.username,
        roomId,
        color: socket.data?.color,
      });
      setTimeout(() => {
        sessionStore.deleteSession(socket.data.userId);
      }, SESSION_DELETE_DELAY);
      const playersLeft = await onLeavingRoom(io, socket, roomId, gameStore);
      console.log(`User ${socket.id} left room ${roomId} from disconnection`);
      io.to(roomId).emit('connectedPlayers', playersLeft);
    }
  };

  socket.on('can_join_room', canJoinRoom);
  socket.on('update_username', updateUsername);
  socket.on('create_room', createRoom);
  socket.on('join_room', joinRoom);
  socket.on('leave_room', leaveRoom);
  socket.on('connectedPlayers', queryConnectedPlayers);
  socket.on('disconnecting', leaveRoomOnDisconnection);
};
