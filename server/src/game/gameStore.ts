import { Server } from 'socket.io';
import { RoomId } from '../room/types';
import { Game } from '.';
import { UserId } from '../socket/types';

export class GameStore {
  games: Map<RoomId, Game>;
  io: Server;

  constructor(io: Server) {
    this.games = new Map();
    this.io = io;
  }

  getGame(roomId: RoomId) {
    const game = this.games.get(roomId);
    if (!game) {
      this.io.to(roomId).emit('game_error', {
        message:
          'There was a problem with the server, your game does not exist anymore',
      });
      return null;
    }
    return game;
  }

  deleteGame(roomId: RoomId) {
    const deleted = this.games.delete(roomId);
    if (deleted)
      console.log(
        `Game of room ${roomId} deleted. Number of games stored: ${this.games.size}`
      );
  }

  createGame(roomId: RoomId, creatorUserId: UserId) {
    this.games.set(roomId, new Game(this.io, roomId, creatorUserId));
    console.log(
      `Game created for room ${roomId}. Number of games stored: ${this.games.size}`
    );
  }
}
