import { Server } from 'socket.io';
import { RoomId } from './types';
import { UserId } from '../socket/types';
import logger from '../logging';
import { Room } from '.';

export class RoomStore extends Map<RoomId, Room> {
  getRoom(io: Server, roomId: RoomId) {
    const room = this.get(roomId);
    if (!room) {
      io.to(roomId).emit('room_error', {
        message:
          'There was a problem with the server, your room does not exist anymore',
      });
      return null;
    }
    return room;
  }

  deleteRoom(roomId: RoomId) {
    const deleted = this.delete(roomId);
    if (deleted) logger.info(`Room ${roomId} deleted.`);
  }

  createRoom(roomId: RoomId, creatorUserId: UserId) {
    this.set(roomId, new Room(roomId, creatorUserId));
    logger.info(`Room ${roomId} created`);
  }
}

const roomStore = new RoomStore();

export default roomStore;
