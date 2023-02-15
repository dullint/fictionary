import { Server } from 'socket.io';
import { RoomId } from './types';
import { UserId } from '../socket/types';
import logger from '../logging';
import { Room } from '.';
import { RoomError } from './errors';

export class RoomStore extends Map<RoomId, Room> {
  getRoom(io: Server, roomId: RoomId) {
    const room = this.get(roomId);
    if (!room) {
      io.to(roomId).emit('room_error', RoomError.roomNotFound);
      return null;
    }
    return room;
  }

  deleteRoom(roomId: RoomId) {
    const deleted = this.delete(roomId);
    if (deleted) logger.info('Room deleted', { roomId });
  }

  createRoom(roomId: RoomId) {
    this.set(roomId, new Room(roomId));
  }
}

const roomStore = new RoomStore();

export default roomStore;
