import { Server } from 'socket.io';
import { Player } from '.';
import { MAX_PLAYER_IN_ROOM } from '../room/constants';
import { RoomId } from '../room/types';
import { UserId } from '../socket/sessionStore';
import { Color } from './type';

export class PlayerStore {
  players: Map<RoomId, Player[]>;
  io: Server;

  constructor(io: Server) {
    this.players = new Map();
    this.io = io;
  }

  getAllPlayers(roomId: RoomId) {
    const allPlayers = this.players.get(roomId);
    if (!allPlayers) {
      this.io.to(roomId).emit('game_error', {
        message:
          'There was a problem with the server, your game does not exist anymore',
      });
      return null;
    }
    return allPlayers;
  }

  getInGamePlayers(roomId: RoomId) {
    const allPlayers = this.getAllPlayers(roomId);
    if (!allPlayers) return null;
    return allPlayers.map((player) => player.isInGame);
  }

  deletePlayer(roomId: RoomId, userId: UserId) {
    const allPlayers = this.getAllPlayers(roomId);
    if (!allPlayers) return;
    this.players.set(
      roomId,
      allPlayers.filter((player) => player.userId != userId)
    );
  }

  addPlayer(roomId: RoomId, userId: UserId, isAdmin: boolean) {
    const allPlayers = this.getAllPlayers(roomId);
    if (!allPlayers) return;
    const color = this._generateColor(allPlayers.map((player) => player.color));
    this.players.set(roomId, [
      ...allPlayers,
      new Player(userId, isAdmin, color),
    ]);
  }

  getOnePlayer(roomId: RoomId, userId: UserId) {
    const allPlayers = this.getAllPlayers(roomId);
    if (!allPlayers) return;
    return allPlayers.find((player) => player.userId == userId);
  }

  _generateColor = (alreadyGivenColors: Color[]) => {
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
