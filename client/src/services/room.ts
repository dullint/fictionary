import { Socket } from 'socket.io-client';
import { GameSettings } from '@server/src/game/types';
import { Player } from '../../../server/src/room/types';
import { Game } from '../../../server/src/game/games';

export const joinRoom = async (
  socket: Socket,
  roomId: string
): Promise<boolean> => {
  return new Promise((rs, rj) => {
    socket.emit('join-room', { roomId });
    socket.on('room_joined', () => rs(true));
    socket.on('join_room_error', (error) => rj(error));
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
): Promise<{ players: Player[]; game: Game }> => {
  return Promise.all([
    new Promise<Game>((rs, rj) => {
      socket.emit('game', { roomId });
      socket.on('game', (players: Game) => rs(players));
    }),
    new Promise<Player[]>((rs, rj) => {
      socket.emit('players', { roomId });
      socket.on('players', (players: Player[]) => rs(players));
    }),
  ]).then(([game, players]) => {
    return { players, game };
  });
};

export const joinGameAndQueryInfo = async (
  socket: Socket,
  roomId: string
): Promise<{ players: Player[]; game: Game }> => {
  return new Promise((rs, rj) => {
    joinRoom(socket, roomId)
      .then(() => {
        const roomInfo = queryRoomInfo(socket, roomId);
        rs(roomInfo);
      })
      .catch((error) => rj(error));
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
