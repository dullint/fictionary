import { Server } from 'socket.io';
import { RoomId } from './types';
import logger from '../logging';
import { Room } from '.';
import { RoomError } from '../handler/errors';

export class RoomStore extends Map<RoomId, Room> {
  getRoom(roomId: RoomId, io?: Server) {
    const room = this.get(roomId);
    if (!room && io) {
      io.to(roomId).emit('room_error', RoomError.roomNotFound);
      return null;
    }
    return room;
  }

  deleteRoom(roomId: RoomId) {
    const deleted = this.delete(roomId);
    if (deleted) logger.info(`[ROOM ${roomId}] Room deleted`);
  }
}

const roomStore = new RoomStore();

export default roomStore;
