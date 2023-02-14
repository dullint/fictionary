import { Player } from '../player';
import { MAX_PLAYER_IN_ROOM, ROOM_DELETE_DELAY } from '../room/constants';
import { RoomId } from '../room/types';
import { RoomStore } from '../room/roomStore';
import { UserId } from '../socket/types';
import logger from '../logging';

export class RoomPlayers extends Map<UserId, Player> {
  constructor() {
    super();
  }

  getAllPlayers() {
    return Array.from(this.values());
  }

  getInGamePlayers() {
    return this.getAllPlayers().filter((player) => player.isInGame);
  }

  deletePlayer(userId: UserId, roomId: RoomId, roomStore: RoomStore) {
    const wasAdmin = this.getOnePlayer(userId)?.isAdmin;
    this.delete(userId);
    const remaningInGamePlayers = this.getInGamePlayers();
    if (remaningInGamePlayers.length === 0) {
      setTimeout(async () => {
        if (this.getInGamePlayers().length === 0) roomStore.deleteRoom(roomId);
      }, ROOM_DELETE_DELAY);
      return;
    }
    if (wasAdmin) {
      remaningInGamePlayers[0].isAdmin = true;
    }
  }

  getOnePlayer(userId: UserId) {
    return this.get(userId);
  }

  addPlayer(userId: UserId) {
    if (this.get(userId)) {
      logger.warn(`user of id ${userId} is already in room`);
      return;
    }
    const isAdmin = this.size === 0;
    const color = this._generateColor();
    this.set(userId, new Player(userId, isAdmin, color));
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
