import { Socket, Server } from 'socket.io';
import { UpdateUsernamePayload, createRoomPayload } from './types';
import {
  checkIfRoomExists,
  checkIfUsernameTaken,
  getPlayers,
  getSocketRoom,
  onLeavingRoom,
  selectColor,
} from './helpers';
import { GameStep } from '../game/types';
import { InMemorySessionStore } from '../socket/sessionStore';
import { MAX_PLAYER_IN_ROOM } from './constants';
import { InMemoryGameStore } from '../socket/gameStore';
import { SESSION_DELETE_DELAY } from '../socket/constants';

export const roomHandler = (
  io: Server,
  socket: Socket,
  sessionStore: InMemorySessionStore,
  gameStore: InMemoryGameStore
) => {
  const updateRoomPlayers = async (roomId: string) => {
    const players = await getPlayers(io, roomId);
    io.to(roomId).emit('players', players);
  };

  const queryPlayers = async () => {
    const roomId = getSocketRoom(socket);
    const players = await getPlayers(io, roomId);
    if (players.length === 0) gameStore.deleteGame(roomId);
    io.to(roomId).emit('players', players);
  };

  const joinRoom = async ({ roomId }: { roomId: string }) => {
    if (!checkIfRoomExists(io, roomId)) {
      socket.emit('join_room_error', {
        message: 'Room do not exist',
      });
      return;
    }
    const otherRoomPlayers = await getPlayers(io, roomId);
    if (otherRoomPlayers.length >= MAX_PLAYER_IN_ROOM) {
      socket.emit('join_room_error', {
        message: `Room size limited to ${MAX_PLAYER_IN_ROOM} players`,
      });
      return;
    }
    const socketOtherRooms = Array.from(socket.rooms.values()).filter(
      (room) => room != roomId && room != socket.id
    );
    if (socketOtherRooms.length > 0) {
      socket.emit('join_room_error', {
        message: 'User already in a room',
      });
      return;
    }
    const game = gameStore.getGame(roomId);
    if (!game) return;
    if (
      game &&
      game.gameStep !== GameStep.WAIT &&
      socket.data?.session?.roomId !== roomId
    ) {
      socket.emit('join_room_error', {
        message: 'Game already in play',
      });
      return;
    }
    if (!Array.from(socket.rooms.values()).includes(roomId)) {
      await socket.join(roomId);
      if (socket.data?.session && socket.data?.session?.roomId === roomId) {
        socket.data.username = socket.data?.session?.username;
        socket.data.color = socket.data?.session?.color;
      }
    }
    socket.emit('room_joined');
    socket.data.color = socket?.data?.color ?? selectColor(otherRoomPlayers);
    console.log(`User ${socket.id} joined room ${roomId}`);
    updateRoomPlayers(roomId);
  };

  const createRoom = async ({ roomId, gameSettings }: createRoomPayload) => {
    await socket.join(roomId);
    socket.emit('room_created');
    const roomPlayers = await getPlayers(io, roomId);
    socket.data.color = selectColor(roomPlayers);
    socket.data.isAdmin = true;
    console.log(`User ${socket.id} created room ${roomId}`);

    updateRoomPlayers(roomId);
    gameStore.createGame(roomId, gameSettings);
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
    updateRoomPlayers(roomId);
  };

  const leaveRoom = async ({ roomId }: { roomId: string }) => {
    await onLeavingRoom(io, socket, roomId, gameStore);
    socket.data.isAdmin = false;
    delete socket.data.username;
    delete socket.data.color;
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
    updateRoomPlayers(roomId);
  };

  const leaveRoomOnDisconnection = async () => {
    const roomId = getSocketRoom(socket);
    if (roomId) {
      sessionStore.saveSession(socket.data.sessionId, {
        username: socket.data?.username,
        roomId,
        color: socket.data?.color,
      });
      setTimeout(() => {
        sessionStore.deleteSession(socket.data.sessionId);
      }, SESSION_DELETE_DELAY);
      const playersLeft = await onLeavingRoom(io, socket, roomId, gameStore);
      console.log(`User ${socket.id} left room ${roomId} from disconnection`);
      io.to(roomId).emit('players', playersLeft);
    }
  };

  socket.on('update_username', updateUsername);
  socket.on('create_room', createRoom);
  socket.on('join_room', joinRoom);
  socket.on('leave_room', leaveRoom);
  socket.on('players', queryPlayers);
  socket.on('disconnecting', leaveRoomOnDisconnection);
};
