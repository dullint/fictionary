import { Socket, Server } from 'socket.io';
import { GameStore } from '../game/gameStore';
import { JoinRoomError } from '../room/errors';
import { MAX_PLAYER_IN_ROOM } from '../room/constants';
import { GameStep } from '../game/types';
import { RoomIdPayload } from '../socket/types';
import logger from '../logging';

export const roomHandler = (
  io: Server,
  socket: Socket,
  gameStore: GameStore
) => {
  const joinRoom = async (payload: RoomIdPayload) => {
    const { roomId } = payload;
    //already in the room
    if (Array.from(socket.rooms.values()).includes(roomId)) {
      socket.emit('room_joined');
      return;
    }
    const userId = socket.data.userId;
    const game = gameStore.getGame(roomId);

    // Room does not exist
    if (!game) {
      socket.emit('join_room_error', {
        type: JoinRoomError.gameNotFound,
      });
      return;
    }
    const gamePlayers = game.players;

    // Room already full
    const alreadyInGamePlayers = gamePlayers.getInGamePlayers();
    if (alreadyInGamePlayers.length >= MAX_PLAYER_IN_ROOM) {
      socket.emit('join_room_error', {
        type: JoinRoomError.gameFull,
      });
      return;
    }

    // Bug and Socket did not left his last room
    const socketOtherRooms = Array.from(socket.rooms.values()).filter(
      (room) => room != roomId && room != socket.id
    );
    if (socketOtherRooms.length > 0) {
      socket.emit('join_room_error', {
        type: JoinRoomError.inAnotherGame,
      });
      return;
    }

    // The game is already launched and he was not part of it
    if (
      game &&
      game.gameStep !== GameStep.WAIT &&
      !gamePlayers.getAllPlayers().includes(userId)
    ) {
      socket.emit('join_room_error', {
        type: JoinRoomError.inAnotherGame,
      });
      return;
    }

    await socket.join(roomId);
    gamePlayers.addPlayer(userId);
    socket.emit('room_joined');
    logger.info(`User ${socket.id} joined room ${roomId}`);
  };

  const createRoom = async (payload: RoomIdPayload) => {
    const { roomId } = payload;
    await socket.join(roomId);
    gameStore.createGame(roomId, socket.data.userId);
    socket.emit('room_created');
    logger.info(`User of id ${socket.data.userId} created room ${roomId}`);
    io.to(roomId).emit('game', gameStore.getGame(roomId)?.info());
  };

  const leaveRoom = ({ roomId }: { roomId: string }) => {
    const game = gameStore.getGame(roomId);
    if (!game) return;
    game.players.deletePlayer(socket.data.userId, roomId, gameStore);
    socket.leave(roomId);
    logger.info(`User of id ${socket.data.userId} left room ${roomId}`);
  };

  socket.on('create_room', createRoom);
  socket.on('join_room', joinRoom);
  socket.on('leave_room', leaveRoom);
};
