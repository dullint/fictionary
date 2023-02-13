import { Socket, Server } from 'socket.io';
import roomStore, { RoomStore } from '../room/roomStore';
import logger from '../logging';
import { getSocketRoom } from '../room/helpers';
import { Username } from '../player/type';

export const playerHandler = (io: Server, socket: Socket) => {
  const updateUsername = async ({ username }: { username: Username }) => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(io, roomId);
    if (!room) return;
    const usernamesInGame = room.players
      .getAllPlayers()
      .map((player) => player.username);
    if (usernamesInGame.includes(username)) {
      socket.emit('update_username_error', {
        message: 'Username already taken',
      });
      return;
    }
    room.players.getOnePlayer(socket.data.userId)?.updateUsername(username);
    logger.debug(
      `User of id ${socket.data.userId} updated his username to ${username}`
    );
    socket.emit('username_updated');
  };

  const disconnecting = () => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(io, roomId);
    if (!room) return;
    room.players.getOnePlayer(socket.data.userId)?.onDisconnect();
    logger.info(`User of id ${socket.data.userId} left room ${roomId}`);
  };

  socket.on('update_username', updateUsername);
  socket.on('disconnecting', disconnecting);
};
