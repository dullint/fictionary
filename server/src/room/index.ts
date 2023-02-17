import { Server } from 'socket.io';
import { UserId } from '../socket/types';

import {
  DEFAULT_GAME_SETTINGS,
  DEFAULT_GAME_STATE,
  ROOM_DELETE_DELAY,
} from './constants';
import roomStore from './roomStore';
import { ClientRoom, GameSettings, GameState, Player, RoomId } from './types';

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
    this.gameSettings = DEFAULT_GAME_SETTINGS;
    this.game = DEFAULT_GAME_STATE;
    this.wordSeen = [];
    this.timer = null;
  }

  getInGamePlayers() {
    return this.players.filter((player) => player.isInGame);
  }

  getOnePlayer(userId: UserId) {
    return this.players.find((player) => player.userId === userId);
  }

  updateClient(io: Server) {
    const clientRoom: ClientRoom = {
      gameState: this.game,
      players: this.getInGamePlayers(),
      gameSettings: this.gameSettings,
    };
    io.to(this.roomId).emit('room', clientRoom);
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
