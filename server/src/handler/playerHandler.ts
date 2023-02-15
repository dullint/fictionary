import { Socket, Server } from 'socket.io';
import roomStore from '../room/roomStore';
import logger from '../logging';
import { getSocketRoom } from '../room/helpers';
import { Username } from '../player/type';
import { UpdateUsernameError } from '../player/errors';

export const playerHandler = (io: Server, socket: Socket) => {
  const updateUsername = async ({ username }: { username: Username }) => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    const usernamesInGame = room.players
      .getAllPlayers()
      .map((player) => player.username);
    if (usernamesInGame.includes(username)) {
      socket.emit('update_username_error', UpdateUsernameError.alreadyTaken);
      return;
    }
    room.players.updateUsername(socket.data.userId, username);
    room.updateClient(io);
    logger.info(`User updated his username to ${username}`, {
      userId: socket.data.userId,
    });
    socket.emit('username_updated');
  };

  const disconnecting = () => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    room.players.onPlayerDisconnect(socket.data.userId);
    room.updateClient(io);
    logger.info(`Left room`, { userId: socket.data.userId, roomId });
  };

  socket.on('update_username', updateUsername);
  socket.on('disconnecting', disconnecting);
};
