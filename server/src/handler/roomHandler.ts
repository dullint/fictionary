import { Socket, Server } from 'socket.io';
import roomStore, { RoomStore } from '../room/roomStore';
import { JoinRoomError } from '../room/errors';
import { MAX_PLAYER_IN_ROOM } from '../room/constants';
import { GameStep } from '../game/types';
import { RoomIdPayload } from '../socket/types';
import logger from '../logging';
import { GameSettings } from '../room/types';
import { getSocketRoom } from '../room/helpers';

export const roomHandler = (io: Server, socket: Socket) => {
  const joinRoom = async (payload: RoomIdPayload) => {
    const { roomId } = payload;
    const userId = socket.data.userId;
    const room = roomStore.get(roomId);

    // Room does not exist
    if (!room) {
      socket.emit('join_room_error', JoinRoomError.roomNotFound);
      return;
    }
    const roomPlayers = room.players;

    // Room already full
    const alreadyInGamePlayers = roomPlayers.getInGamePlayers();
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

    const userIsAlreadyInRoom = roomPlayers
      .getAllPlayers()
      .map((player) => player.userId)
      .includes(userId);

    // The game is already launched and he was not part of it
    if (room.game.gameStep !== GameStep.WAIT && !userIsAlreadyInRoom) {
      socket.emit('join_room_error', JoinRoomError.gameAlreadyLaunched);
      return;
    }

    if (userIsAlreadyInRoom) {
      roomPlayers.onPlayerRejoinRoom(userId);
      logger.info(`User rejoined room`, { userId, roomId });
    } else {
      roomPlayers.addPlayer(userId);
      logger.info(`User joined room`, { userId, roomId });
    }
    socket.emit('room_joined');
    await socket.join(roomId);
    room.updateClient(io);
  };

  const createRoom = async (payload: RoomIdPayload) => {
    const { roomId } = payload;
    await socket.join(roomId);
    roomStore.createRoom(roomId);
    logger.info(`User created room ${roomId}`, {
      userId: socket.data.userId,
      roomId,
    });
    socket.emit('room_created');
  };

  const leaveRoom = ({ roomId }: { roomId: string }) => {
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    room.players.deletePlayer(socket.data.userId, room, io);
    room.deleteIfNoPlayerLeft();
    socket.leave(roomId);
    room.updateClient(io);
    logger.info(`User left room `, {
      userId: socket.data.userId,
      roomId,
    });
  };

  const changeGameSettings = ({
    gameSettings,
  }: {
    gameSettings: GameSettings;
  }) => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    room.updateGameSettings(gameSettings);
    room.updateClient(io);
  };

  socket.on('create_room', createRoom);
  socket.on('join_room', joinRoom);
  socket.on('leave_room', leaveRoom);
  socket.on('change_game_settings', changeGameSettings);
};
