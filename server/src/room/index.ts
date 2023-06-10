import { Server } from 'socket.io';
import { UserId } from '../socket/types';

import {
  DEFAULT_GAME_SETTINGS,
  DEFAULT_GAME_STATE,
  ROOM_DELETE_DELAY,
} from './constants';
import roomStore from './roomStore';
import {
  ClientRoom,
  GameSettings,
  GameState,
  GameStep,
  Player,
  RoomId,
} from './types';

export class Room {
  roomId: RoomId;
  game: GameState;
  players: Player[];
  gameSettings: GameSettings;
  wordSeen: string[];
  timer: NodeJS.Timer | null;

  constructor(roomId: string) {
    this.roomId = roomId;
    this.players = [];
    this.gameSettings = Object.assign({}, DEFAULT_GAME_SETTINGS);
    this.game = Object.assign({}, DEFAULT_GAME_STATE);
    this.wordSeen = [];
    this.timer = null;
  }

  getInGamePlayers() {
    return this.players.filter((player) => player.isInGame);
  }

  getOnePlayer(userId: UserId) {
    return this.players.find((player) => player.userId === userId);
  }

  getRoomClient(): ClientRoom {
    return {
      gameState: this.game,
      players: this.players,
      gameSettings: this.gameSettings,
    };
  }

  updateClient(io: Server) {
    io.to(this.roomId).emit('room', this.getRoomClient());
  }

  deleteIfNoPlayerLeft() {
    const players = this.getInGamePlayers();
    if (players.length === 0) {
      setTimeout(async () => {
        if (this.getInGamePlayers().length === 0) {
          roomStore.deleteRoom(this.roomId);
        }
      }, ROOM_DELETE_DELAY);
      return;
    }
  }
}
