import { Server } from 'socket.io';
import { GameManager } from '../game';
import { RoomPlayers } from '../player';

import { DEFAULT_GAME_SETTINGS, ROOM_DELETE_DELAY } from './constants';
import roomStore from './roomStore';
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

  deleteIfNoPlayerLeft() {
    const players = this.players.getInGamePlayers();
    if (players.length === 0) {
      setTimeout(async () => {
        if (this.players.getInGamePlayers().length === 0)
          roomStore.deleteRoom(this.roomId);
      }, ROOM_DELETE_DELAY);
      return;
    }
  }
}
