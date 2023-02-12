import { Socket, Server } from 'socket.io';
import { GameStore } from '../game/gameStore';
import logger from '../logging';
import { getSocketRoom } from '../room/helpers';
import { UpdateUsernamePayload } from '../socket/types';

export const playerHandler = (
  io: Server,
  socket: Socket,
  gameStore: GameStore
) => {
  const updateUsername = async (payload: UpdateUsernamePayload) => {
    const { roomId, username } = payload;
    const game = gameStore.getGame(roomId);
    if (!game) return;
    const usernamesInGame = game.players
      .getAllPlayers()
      .map((player) => player.username);
    if (usernamesInGame.includes(username)) {
      socket.emit('update_username_error', {
        message: 'Username already taken',
      });
      return;
    }
    game.players.getOnePlayer(socket.data.userId)?.updateUsername(username);
    socket.emit('username_updated');
  };

  const disconnecting = () => {
    const roomId = getSocketRoom(socket);
    const game = gameStore.getGame(roomId);
    game?.players.getOnePlayer(socket.data.userId)?.onDisconnect();
    logger.info(`User of id ${socket.data.userId} left room ${roomId}`);
  };

  socket.on('update_username', updateUsername);
  socket.on('disconnecting', disconnecting);
};
