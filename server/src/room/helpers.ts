import { Socket } from 'socket.io';

export const getSocketRoom = (socket: Socket) =>
  Array.from(socket.rooms.values()).filter(
    (roomId) => roomId !== socket.id
  )?.[0];
