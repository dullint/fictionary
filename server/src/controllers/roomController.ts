import { Room } from '../models/room';

export class RoomController {
  private rooms: Map<string, Room>;

  constructor() {
    this.rooms = new Map<string, Room>();
  }

  createRoom(roomId: string) {}

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }
}

export const roomController = new RoomController();
