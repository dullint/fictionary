import { Server } from 'socket.io';
import roomStore from '../room/roomStore';
import {
  DISCONNECT_FROM_GAME_DELAY,
  MAX_PLAYER_IN_ROOM,
} from '../room/constants';
import { EventCallback, ServerSocket } from '../socket/types';
import logger from '../logging';
import { GameStep, RoomId } from '../room/types';
import {
  generateNewPlayer,
  getSocketRoom,
  goToNextGameStepIfNeededAfterPlayerLeave,
} from '../room/helpers';
import { JoinRoomError } from './errors';
import { Room } from '../room';

export const roomHandler = (io: Server, socket: ServerSocket) => {
  const joinRoom = async (roomId: RoomId, callback: EventCallback) => {
    const userId = socket.data.userId;
    const room = roomStore.get(roomId);

    // Room does not exist
    if (!room) {
      callback({
        success: false,
        error: JoinRoomError.roomNotFound,
      });
      return;
    }

    // Room already full
    const alreadyInGamePlayers = room.getInGamePlayers();
    if (alreadyInGamePlayers.length >= MAX_PLAYER_IN_ROOM) {
      callback({
        success: false,
        error: JoinRoomError.roomFull,
      });
      return;
    }

    // Bug and Socket did not left his last room
    const socketOtherRooms = Array.from(socket.rooms.values()).filter(
      (room) => room != roomId && room != socket.id
    );
    if (socketOtherRooms.length > 0) {
      callback({
        success: false,
        error: JoinRoomError.inAnotherRoom,
      });
      return;
    }

    const userAlreadyInRoom = room.getOnePlayer(userId);

    // The game is already launched and he was not part of it
    if (room.game.gameStep !== GameStep.WAIT && !userAlreadyInRoom) {
      callback({
        success: false,
        error: JoinRoomError.gameAlreadyLaunched,
      });
      return;
    }

    if (userAlreadyInRoom) {
      if (!userAlreadyInRoom.isConnected)
        logger.info(`[ROOM ${roomId}] User ${userId} rejoined room ${roomId}`);
      userAlreadyInRoom.isConnected = true;
      userAlreadyInRoom.isInGame = true;
    } else {
      room.players.push(generateNewPlayer(userId, room.players));
      logger.info(`[ROOM ${roomId}] User ${userId} joined room ${roomId}`);
    }
    await socket.join(roomId);
    callback({
      success: true,
    });
    room.updateClient(io);
  };

  const createRoom = async (roomId: RoomId, callback: EventCallback) => {
    await socket.join(roomId);
    const userId = socket.data.userId;
    const room = new Room(roomId);
    roomStore.set(roomId, room);
    logger.info(`[ROOM ${roomId}] User ${userId} created room`);
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

    logger.info(`[ROOM ${roomId}] User ${userId} left room`);
    room.players = room.players.filter((player) => player.userId != userId);
    socket.leave(roomId);

    //find New admin
    const remaningInGamePlayers = room.getInGamePlayers();
    if (wasAdmin && remaningInGamePlayers.length > 0) {
      remaningInGamePlayers[0].isAdmin = true;
    }

    goToNextGameStepIfNeededAfterPlayerLeave(io, room);
    room.deleteIfNoPlayerLeft();

    room.updateClient(io);
  };

  const disconnecting = () => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    const userId = socket.data.userId;
    if (!room) return;
    const player = room.getOnePlayer(userId);
    if (!player) return;
    if (!player.username) {
      leaveRoom({ roomId });
    }
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
      goToNextGameStepIfNeededAfterPlayerLeave(io, room);
      logger.info(
        `[ROOM ${roomId}] User ${userId} out of game after disconnection`
      );
      room.updateClient(io);
    }, DISCONNECT_FROM_GAME_DELAY);

    room.deleteIfNoPlayerLeft();
    room.updateClient(io);

    logger.info(`[ROOM ${roomId}] User ${userId} disconnecting`);
  };

  socket.on('disconnecting', disconnecting);
  socket.on('create_room', createRoom);
  socket.on('join_room', joinRoom);
  socket.on('leave_room', leaveRoom);
};
