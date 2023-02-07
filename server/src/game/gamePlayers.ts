import { Server } from 'socket.io';
import { Player } from '../player';
import { MAX_PLAYER_IN_ROOM } from '../room/constants';
import { RoomId } from '../room/types';
import { UserId } from '../socket/sessionStore';
import { Color } from '../player/type';

export class GamePlayers {
  players: Map<UserId, Player>;

  constructor() {
    this.players = new Map();
  }

  getAllPlayers() {
    return Array.from(this.players.values());
  }

  getInGamePlayers() {
    return this.getAllPlayers().filter((player) => player.isInGame);
  }

  deletePlayer(userId: UserId) {
    this.players.delete(userId);
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
