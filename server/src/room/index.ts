import { GameManager } from '../game';
import { RoomPlayers } from '../roomPlayers';
import { UserId } from '../socket/types';
import { DEFAULT_GAME_SETTINGS } from './constants';
import { ClientRoom, GameSettings, RoomId } from './types';

export class Room {
  roomId: RoomId;
  game: GameManager;
  players: RoomPlayers;
  gameSettings: GameSettings;

  constructor(roomId: string, creatorUserId: UserId) {
    this.roomId = roomId;
    this.players = new RoomPlayers(creatorUserId);
    this.gameSettings = DEFAULT_GAME_SETTINGS;
    this.game = new GameManager(roomId);
  }

  updateGameSettings(gameSettings: GameSettings) {
    this.gameSettings = gameSettings;
  }

  getRoomAfterJoin(): ClientRoom {
    return {
      gameState: this.game.getState(),
      players: this.players.getInGamePlayers(),
      gameSettings: this.gameSettings,
    };
  }
}
