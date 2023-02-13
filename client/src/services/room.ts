import { Socket } from 'socket.io-client';
import { ClientRoom } from '../../../server/src/room/types';

export const joinRoom = async (
  socket: Socket,
  roomId: string
): Promise<ClientRoom> => {
  return new Promise((rs, rj) => {
    socket.emit('join_room', { roomId });
    socket.on('room_joined', (room: ClientRoom) => {
      rs(room);
    });
    socket.on('join_room_error', (error) => {
      rj(error);
    });
  });
};
export const checkRoomExistence = async (
  socket: Socket,
  roomId: string
): Promise<boolean> => {
  return new Promise((rs, rj) => {
    socket.emit('check_room_existence', { roomId });
    socket.on('room_existence', (existence) => rs(existence));
  });
};

// export const getGame = async (
//   socket: Socket,
//   roomId: string
// ): Promise<Game> => {
//   return new Promise<Game>((rs, rj) => {
//     socket.emit('game', { roomId });
//     socket.on('game', (game: Game) => rs(game));
//   });
// };

export const createRoom = async (
  socket: Socket,
  roomId: string
): Promise<boolean> => {
  return new Promise((rs, rj) => {
    socket.emit('create_room', { roomId });
    socket.on('room_created', () => rs(true));
    socket.on('create_room_error', (error) => rj(error));
  });
};

export const updateUsername = async (
  socket: Socket,
  roomId: string,
  username: string
): Promise<boolean> => {
  return new Promise((rs, rj) => {
    socket.emit('update_username', { roomId, username });
    socket.on('username_updated', () => rs(true));
    socket.on('update_username_error', (error) => rj(error));
  });
};
