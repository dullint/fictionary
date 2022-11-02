import { Socket, Server } from 'socket.io';
import { UpdateUsernamePayload, createRoomPayload } from './types';
import GAMES, { Game } from '../game/games';
import {
  checkIfRoomExists,
  checkIfUsernameTaken,
  generateInviteUsername,
  getPlayers,
  getSocketRoom,
  selectColor,
  selectNewAdmin,
} from './helpers';

export const roomHandler = (io: Server, socket: Socket) => {
  const updateRoomPlayers = async (roomId: string) => {
    const players = await getPlayers(io, roomId);
    io.to(roomId).emit('players', players);
  };

  const queryPlayers = async () => {
    const roomId = getSocketRoom(socket);
    const players = await getPlayers(io, roomId);
    io.to(roomId).emit('players', players);
  };

  const joinRoom = async ({ roomId }: { roomId: string }) => {
    if (Array.from(socket.rooms.values()).includes(roomId)) return;
    if (!checkIfRoomExists(io, roomId)) {
      console.log('Room do not exist');
      socket.emit('room_join_error', {
        message: 'Room do not exist',
      });
    } else {
      await socket.join(roomId);
      socket.emit('room_joined');
      socket.data.color = selectColor((await getPlayers(io, roomId)).length);
      socket.data.username = generateInviteUsername();
      console.log(
        `User ${socket.id} of username ${socket.data.username}  joined room: ${roomId}`
      );
      updateRoomPlayers(roomId);
    }
  };

  const createRoom = async ({ roomId, gameSettings }: createRoomPayload) => {
    await socket.join(roomId);
    socket.emit('room_created');
    socket.data.color = selectColor((await getPlayers(io, roomId)).length);
    socket.data.username = generateInviteUsername();
    socket.data.isAdmin = true;
    console.log(
      `User ${socket.id} of username ${socket.data.username}  created room: ${roomId}`
    );

    updateRoomPlayers(roomId);
    GAMES.set(roomId, new Game(gameSettings));
    io.to(roomId).emit('game', GAMES.get(roomId));
  };

  const updateUsername = async ({
    roomId,
    username,
  }: UpdateUsernamePayload) => {
    if (await checkIfUsernameTaken(io, roomId, username)) {
      console.log('Username already taken');
      socket.emit('update_username_error', {
        message: 'Username already taken',
      });
    } else {
      socket.emit('username_updated');
      console.log(
        `User ${socket.data.username} changed his username to ${username}`
      );
      socket.data.username = username;
      updateRoomPlayers(roomId);
    }
  };

  const leaveRoom = async ({ roomId }: { roomId: string }) => {
    if (socket.data?.isAdmin) {
      selectNewAdmin(io, socket.id, roomId);
    }
    socket.leave(roomId);
    console.log(`User ${socket.id} left room: ${roomId}`);
    updateRoomPlayers(roomId);
  };

  const deleteRoom = ({ roomId }: { roomId: string }) => {
    GAMES.delete(roomId);
    io.in(roomId).socketsLeave(roomId);
  };

  socket.on('update_username', updateUsername);
  socket.on('create_room', createRoom);
  socket.on('join_room', joinRoom);
  socket.on('leave_room', leaveRoom);
  socket.on('players', queryPlayers);
};
