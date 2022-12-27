import { Socket } from 'socket.io-client';
import { GameSettings } from '../../../server/src/game/types';
import { Player } from '../../../server/src/room/types';
import { Game } from '../../../server/src/game/gameManager';

export const joinRoom = async (
  socket: Socket,
  roomId: string
): Promise<boolean> => {
  return new Promise((rs, rj) => {
    socket.emit('join_room', { roomId });
    socket.on('room_joined', () => {
      rs(true);
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

export const queryRoomInfo = async (
  socket: Socket,
  roomId: string
): Promise<{ playersConnected: Player[]; game: Game }> => {
  return Promise.all([
    new Promise<Game>((rs, rj) => {
      socket.emit('game', { roomId });
      socket.on('game', (game: Game) => rs(game));
    }),
    new Promise<Player[]>((rs, rj) => {
      socket.emit('connectedPlayers', { roomId });
      socket.on('connectedPlayers', (playersConnected: Player[]) =>
        rs(playersConnected)
      );
    }),
  ]).then(([game, playersConnected]) => {
    return { playersConnected, game };
  });
};

export const createRoom = async (
  socket: Socket,
  roomId: string,
  gameSettings: GameSettings
): Promise<boolean> => {
  return new Promise((rs, rj) => {
    socket.emit('create_room', { roomId, gameSettings });
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
