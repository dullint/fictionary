import { Server } from 'socket.io';
import { RoomId } from '../room/types';
import { Game } from '../game/gameManager';
import { GameSettings } from '../game/types';

export class InMemoryGameStore {
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

  createGame(roomId: RoomId, gameSettings: GameSettings) {
    this.games.set(roomId, new Game(this.io, roomId, gameSettings));
    console.log(
      `Game created for room ${roomId}. Number of games stored: ${this.games.size}`
    );
  }
}
