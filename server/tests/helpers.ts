import { io, Socket } from 'socket.io-client';
import { ClientRoom, RoomId } from '../src/room/types';
import { ServerResponse } from '../src/socket/types';

export const connectSocket = (serverAddress: string, userId: string) => {
  const socket = io(serverAddress, {
    autoConnect: false,
    forceNew: true,
  });
  socket.auth = { userId };
  socket.connect();
  return socket;
};

export const createRoom = async (clientSocket: Socket, roomId: RoomId) => {
  return await new Promise<boolean>((rs, rj) => {
    clientSocket.emit('create_room', roomId, (response: ServerResponse) => {
      const { success, error } = response;
      if (!success) rj(error);
      rs(true);
    });
  });
};

export const joinRoom = async (
  clientSocket: Socket,
  roomId: RoomId,
  receiverClientSocket?: Socket
) => {
  return await new Promise<ClientRoom>((rs, rj) => {
    clientSocket.emit('join_room', roomId, (response: ServerResponse) => {
      const { success, error } = response;
      if (!success) rj(error);
      (receiverClientSocket ?? clientSocket).on('room', (room: ClientRoom) => {
        rs(room);
      });
    });
  });
};

export const roomUpdate = async (clientSocket: Socket) => {
  return await new Promise<ClientRoom>((rs, _) => {
    clientSocket.on('room', (room: ClientRoom) => {
      rs(room);
    });
  });
};

export const wait = (ms: number) => {
  return new Promise((rs, _) => {
    setTimeout(() => rs(true), ms);
  });
};
