import { Server, Socket } from 'socket.io';

export class SocketManager {
  private static instance: SocketManager;
  private io: Server;

  private constructor(io: Server) {
    this.io = io;
  }

  static getInstance(io: Server) {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager(io);
    }
    return SocketManager.instance;
  }

  sendMessageToRoom(roomId: string, message: string, payload: any) {
    this.io.to(roomId).emit(message, payload);
  }
}
