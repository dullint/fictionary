import { ClientRoom } from '../../server/src/room/types';
// import { CONNECT_TIMEOUT } from './components/Room/constants';
import socket from './socket';

// const timeout = (time: number, error: string) =>
//   new Promise((_, reject) => {
//     const id = setTimeout(() => {
//       clearTimeout(id);
//       reject(error);
//     }, time);
//   });

export const joinRoom = async (roomId: string): Promise<ClientRoom> => {
  return new Promise<ClientRoom>((rs, rj) => {
    socket.emit('join_room', { roomId });
    socket.on('room_joined', (room: ClientRoom) => {
      rs(room);
    });
    socket.on('join_room_error', (error) => {
      rj(error);
    });
  });
};

export const checkRoomExistence = async (roomId: string): Promise<boolean> => {
  return new Promise((rs, rj) => {
    socket.emit('check_room_existence', { roomId });
    socket.on('room_existence', (existence) => rs(existence));
  });
};

export const createRoom = async (roomId: string): Promise<boolean> => {
  return new Promise((rs, rj) => {
    socket.emit('create_room', { roomId });
    socket.on('room_created', () => rs(true));
    socket.on('create_room_error', (error) => rj(error));
  });
};

export const updateUsername = async (username: string): Promise<boolean> => {
  return new Promise((rs, rj) => {
    socket.emit('update_username', { username });
    socket.on('username_updated', () => rs(true));
    socket.on('update_username_error', (error) => rj(error));
  });
};
