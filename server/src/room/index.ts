import { Server } from 'socket.io';
import { GameManager } from '../game';
import { RoomPlayers } from '../roomPlayers';

import { DEFAULT_GAME_SETTINGS } from './constants';
import { ClientRoom, GameSettings, RoomId } from './types';

export class Room {
  roomId: RoomId;
  game: GameManager;
  players: RoomPlayers;
  gameSettings: GameSettings;

  constructor(roomId: string) {
    this.roomId = roomId;
    this.players = new RoomPlayers();
    this.gameSettings = DEFAULT_GAME_SETTINGS;
    this.game = new GameManager(roomId);
  }

  updateGameSettings(gameSettings: GameSettings) {
    this.gameSettings = gameSettings;
  }

  updateClient(io: Server) {
    const clientRoom: ClientRoom = {
      gameState: this.game.getState(),
      players: this.players.getInGamePlayers(),
      gameSettings: this.gameSettings,
    };
    io.to(this.roomId).emit('room', clientRoom);
  }
}
