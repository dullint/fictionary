import { Server } from 'socket.io';
import { Player } from '../player';
import { MAX_PLAYER_IN_ROOM } from '../room/constants';
import { RoomId } from '../room/types';
import { Color } from '../player/type';
import { GAME_DELETE_DELAY } from './constant';
import { GameStore } from './gameStore';
import { UserId } from '../socket/types';

export class GamePlayers {
  players: Map<UserId, Player>;

  constructor(creatorUserId: UserId) {
    this.players = new Map();
    this.addPlayer(creatorUserId);
  }

  getAllPlayers() {
    return Array.from(this.players.values());
  }

  getInGamePlayers() {
    return this.getAllPlayers().filter((player) => player.isInGame);
  }

  deletePlayer(userId: UserId, roomId: RoomId, gameStore: GameStore) {
    const wasAdmin = this.getOnePlayer(userId)?.isAdmin;
    this.players.delete(userId);
    const remaningInGamePlayers = this.getInGamePlayers();
    if (remaningInGamePlayers.length === 0) {
      setTimeout(async () => {
        if (this.getInGamePlayers().length === 0) gameStore.deleteGame(roomId);
      }, GAME_DELETE_DELAY);
      return;
    }
    if (wasAdmin) {
      remaningInGamePlayers[0].isAdmin = true;
    }
  }

  getOnePlayer(userId: UserId) {
    return this.players.get(userId);
  }

  addPlayer(userId: UserId) {
    const isAdmin = this.players.size === 0;
    const color = this._generateColor();
    this.players.set(userId, new Player(userId, isAdmin, color));
  }

  _generateColor = () => {
    const alreadyGivenColors = this.getAllPlayers().map(
      (player) => player.color
    );
    const possibleHues = Array.from(Array(MAX_PLAYER_IN_ROOM).keys()).map(
      (n) => n * 137.508
    );
    const possibleColors = possibleHues.map((hue) => `hsl(${hue},100%,80%)`);
    const shuffledPossibleColors = possibleColors.sort(
      (a, b) => 0.5 - Math.random()
    );
    const newColor =
      shuffledPossibleColors.filter(
        (color) => !alreadyGivenColors.includes(color)
      )?.[0] ?? 'white';
    return newColor;
  };
}
