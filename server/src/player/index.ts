import { Server } from 'socket.io';
import { GameStep } from '../game/types';
import logger from '../logging';
import { Room } from '../room';
import { MAX_PLAYER_IN_ROOM, ROOM_DELETE_DELAY } from '../room/constants';
import { RoomStore } from '../room/roomStore';
import { RoomId } from '../room/types';
import { UserId } from '../socket/types';
import { DISCONNECT_FROM_GAME_DELAY } from './constants';
import { Color, Username } from './type';

export class Player {
  username?: Username;
  color: Color;
  userId: UserId;
  isConnected: boolean;
  isInGame: boolean;
  isAdmin: boolean;

  constructor(userId: UserId, isAdmin: boolean, color: Color) {
    this.username = undefined;
    this.color = color;
    this.userId = userId;
    this.isConnected = true;
    this.isInGame = true;
    this.isAdmin = isAdmin;
  }
}

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
      logger.warn('user is already in room', { userId });
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

  updateUsername(userId: UserId, username: Username) {
    const player = this.getOnePlayer(userId);
    if (!player) return;
    player.username = username;
  }

  onPlayerDisconnect(userId: UserId, room: Room, io: Server) {
    const player = this.getOnePlayer(userId);
    if (!player) return;
    player.isConnected = false;
    setTimeout(() => {
      if (!player.isConnected) {
        player.isInGame = false;
        logger.debug('User ejected from game after disconnection', { userId });
        const game = room.game;
        if (game.gameStep == GameStep.PROMPT) {
          const numberOfDefinitions = Object.values(game.inputEntries).filter(
            (entry) => !entry?.autosave
          ).length;
          const numberOfPlayers = room.players.getInGamePlayers().length;
          if (numberOfDefinitions == numberOfPlayers) {
            game.goToNextStep(room.gameSettings);
          }
        }
        if (game.gameStep == GameStep.GUESS) {
          const numberOfPlayers = room.players.getInGamePlayers().length;
          const numberOfSelectedDefinitions = Object.keys(
            game.selections
          ).length;
          if (numberOfSelectedDefinitions == numberOfPlayers) {
            game.goToNextStep(room.gameSettings);
          }
        }
        room.updateClient(io);
      }
    }, DISCONNECT_FROM_GAME_DELAY);
  }

  onPlayerRejoinRoom(userId: UserId) {
    const player = this.getOnePlayer(userId);
    if (!player) return;
    player.isConnected = true;
    player.isInGame = true;
  }
}
