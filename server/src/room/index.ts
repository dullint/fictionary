import { Socket, Server } from 'socket.io';
import { UpdateUsernamePayload, createRoomPayload } from './types';
import GAMES, { Game } from '../game/gameManager';
import {
  checkIfRoomExists,
  checkIfUsernameTaken,
  getPlayers,
  getSocketRoom,
  onLeavingRoom,
  selectColor,
} from './helpers';
import { GameStep } from '../game/types';

export const roomHandler = (io: Server, socket: Socket) => {
  const updateRoomPlayers = async (roomId: string) => {
    const players = await getPlayers(io, roomId);
    io.to(roomId).emit('players', players);
  };

  const queryPlayers = async () => {
    const roomId = getSocketRoom(socket);
    const players = await getPlayers(io, roomId);
    if (players.length === 0) GAMES.delete(roomId);
    io.to(roomId).emit('players', players);
  };

  const joinRoom = async ({ roomId }: { roomId: string }) => {
    if (!checkIfRoomExists(io, roomId)) {
      socket.emit('join_room_error', {
        message: 'Room do not exist',
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
    if (!Array.from(socket.rooms.values()).includes(roomId)) {
      await socket.join(roomId);
    }
    const game = GAMES.get(roomId);
    if (!game) return;
    if (game && game.gameStep !== GameStep.WAIT && !socket.data.username) {
      socket.emit('join_room_error', {
        message: 'Game already in play',
      });
      return;
    }
    socket.emit('room_joined');
    socket.data.color =
      socket?.data?.color ?? selectColor((await getPlayers(io, roomId)).length);
    console.log(`User ${socket.id} joined room ${roomId}`);
    updateRoomPlayers(roomId);
  };

  const createRoom = async ({ roomId, gameSettings }: createRoomPayload) => {
    await socket.join(roomId);
    socket.emit('room_created');
    socket.data.color = selectColor((await getPlayers(io, roomId)).length);
    socket.data.isAdmin = true;
    console.log(`User ${socket.id} created room ${roomId}`);

    updateRoomPlayers(roomId);
    GAMES.set(roomId, new Game(io, roomId, gameSettings));
    io.to(roomId).emit('game', GAMES.get(roomId)?.info());
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
    socket.emit('username_updated');
    socket.data.username = username;
    updateRoomPlayers(roomId);
  };

  const leaveRoom = async ({ roomId }: { roomId: string }) => {
    await onLeavingRoom(io, socket, roomId);
    socket.data.isAdmin = false;
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
    updateRoomPlayers(roomId);
  };

  socket.on('update_username', updateUsername);
  socket.on('create_room', createRoom);
  socket.on('join_room', joinRoom);
  socket.on('leave_room', leaveRoom);
  socket.on('players', queryPlayers);
};