import { Server } from 'socket.io';
import roomStore from '../room/roomStore';
import {
  DISCONNECT_FROM_GAME_DELAY,
  MAX_PLAYER_IN_ROOM,
} from '../room/constants';
import { CallbackResponse, RoomIdPayload, ServerSocket } from '../socket/types';
import logger from '../logging';
import { GameSettings, GameStep, RoomId } from '../room/types';
import {
  generateNewPlayer,
  getSocketRoom,
  goToNextGameStepIfNeededAfterPlayerLeave,
} from '../room/helpers';
import { JoinRoomError } from './errors';
import { Room } from '../room';

export const roomHandler = (io: Server, socket: ServerSocket) => {
  const joinRoom = async (payload: RoomIdPayload) => {
    const { roomId } = payload;
    const userId = socket.data.userId;
    const room = roomStore.get(roomId);

    // Room does not exist
    if (!room) {
      socket.emit('join_room_error', JoinRoomError.roomNotFound);
      return;
    }

    // Room already full
    const alreadyInGamePlayers = room.getInGamePlayers();
    if (alreadyInGamePlayers.length >= MAX_PLAYER_IN_ROOM) {
      socket.emit('join_room_error', JoinRoomError.roomFull);
      return;
    }

    // Bug and Socket did not left his last room
    const socketOtherRooms = Array.from(socket.rooms.values()).filter(
      (room) => room != roomId && room != socket.id
    );
    if (socketOtherRooms.length > 0) {
      socket.emit('join_room_error', JoinRoomError.inAnotherRoom);
      return;
    }

    const userAlreadyInRoom = room.getOnePlayer(userId);

    // The game is already launched and he was not part of it
    if (room.game.gameStep !== GameStep.WAIT && !userAlreadyInRoom) {
      socket.emit('join_room_error', JoinRoomError.gameAlreadyLaunched);
      return;
    }

    if (userAlreadyInRoom) {
      userAlreadyInRoom.isConnected = true;
      userAlreadyInRoom.isInGame = true;
      logger.info(`User rejoined room`, { userId, roomId });
    } else {
      room.players.push(generateNewPlayer(userId, room.players));
      logger.info(`User joined room`, { userId, roomId });
    }
    socket.emit('room_joined', {
      gameState: room.game,
      players: room.getInGamePlayers(),
      gameSettings: room.gameSettings,
    });
    await socket.join(roomId);
  };

  const createRoom = async (roomId: RoomId, callback: CallbackResponse) => {
    await socket.join(roomId);
    const room = new Room(roomId);
    roomStore.set(roomId, room);
    logger.info(`User created room ${roomId}`, {
      userId: socket.data.userId,
      roomId,
    });
    callback({
      success: true,
    });
  };

  const leaveRoom = ({ roomId }: { roomId: string }) => {
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    const userId = socket.data.userId;
    const player = room.getOnePlayer(userId);
    if (!player) return;
    const wasAdmin = player.isAdmin;

    logger.info(`User left room `, {
      userId: socket.data.userId,
      roomId,
    });
    room.players = room.players.filter((player) => player.userId != userId);
    socket.leave(roomId);

    //find New admin
    const remaningInGamePlayers = room.getInGamePlayers();
    if (wasAdmin && remaningInGamePlayers.length > 0) {
      remaningInGamePlayers[0].isAdmin = true;
    }

    goToNextGameStepIfNeededAfterPlayerLeave(room);
    room.deleteIfNoPlayerLeft();

    room.updateClient(io);
  };

  const changeGameSettings = ({
    gameSettings,
  }: {
    gameSettings: GameSettings;
  }) => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    room.gameSettings = gameSettings;
    logger.info(`Game settings changed in ${roomId}`, { gameSettings });
    room.updateClient(io);
  };

  const disconnecting = () => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    const userId = socket.data.userId;
    if (!room) return;
    const player = room.getOnePlayer(userId);
    if (!player) return;
    player.isConnected = false;

    setTimeout(() => {
      if (player.isConnected) return;
      player.isInGame = false;
      //find New admin
      const remaningInGamePlayers = room.getInGamePlayers();
      if (player.isAdmin && remaningInGamePlayers.length > 0) {
        player.isAdmin = false;
        remaningInGamePlayers[0].isAdmin = true;
      }
      goToNextGameStepIfNeededAfterPlayerLeave(room);
      logger.info('User out of game after disconnection', {
        userId,
        roomId,
      });
      room.updateClient(io);
    }, DISCONNECT_FROM_GAME_DELAY);

    room.deleteIfNoPlayerLeft();
    room.updateClient(io);

    logger.info(`User disconnecting`, { userId, roomId });
  };

  socket.on('disconnecting', disconnecting);
  socket.on('create_room', createRoom);
  socket.on('join_room', joinRoom);
  socket.on('leave_room', leaveRoom);
  socket.on('change_game_settings', changeGameSettings);
};
