import { io, Socket } from 'socket.io-client';
import { ClientRoom, RoomId } from '../src/room/types';
import { ServerResponse } from '../src/socket/types';

export const testConnectSocket = (serverAddress: string, userId: string) => {
  const socket = io(serverAddress, {
    autoConnect: false,
    forceNew: true,
  });
  socket.auth = { userId };
  socket.connect();
  return socket;
};

export const testCreateRoom = async (clientSocket: Socket, roomId: RoomId) => {
  return await new Promise<boolean>((rs, rj) => {
    clientSocket.emit('create_room', roomId, (response: ServerResponse) => {
      const { success, error } = response;
      if (success) rs(success);
      rj(error);
    });
  });
};

export const testJoinRoom = async (clientSocket: Socket, roomId: RoomId) => {
  return await new Promise<ClientRoom>((rs, rj) => {
    clientSocket.emit(
      'join_room',
      roomId,
      (response: { room: ClientRoom | null; error?: string }) => {
        const { room, error } = response;
        if (room) rs(room);
        rj(error);
      }
    );
  });
};
