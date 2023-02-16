import { Server } from 'socket.io';
import { GameStep } from '../game/types';
import logger from '../logging';
import { Room } from '../room';
import { MAX_PLAYER_IN_ROOM, ROOM_DELETE_DELAY } from '../room/constants';
import roomStore, { RoomStore } from '../room/roomStore';
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

  deletePlayer(userId: UserId, room: Room, io: Server) {
    const player = this.getOnePlayer(userId);
    if (!player) return;
    const wasAdmin = player.isAdmin;
    this.delete(userId);

    //set him out of the game
    const remaningInGamePlayers = this.getInGamePlayers();
    if (wasAdmin && remaningInGamePlayers.length > 0) {
      remaningInGamePlayers[0].isAdmin = true;
      console.log('new Admin', remaningInGamePlayers[0].username);
    }
    logger.debug('User ejected from game after disconnection', { userId });
    const game = room.game;
    if (game.gameStep == GameStep.PROMPT) {
      const numberOfDefinitions = Object.values(game.inputEntries).filter(
        (entry) => !entry?.autosave
      ).length;
      const numberOfPlayers = this.getInGamePlayers().length;
      if (numberOfDefinitions == numberOfPlayers) {
        game.goToNextStep(room.gameSettings);
      }
    }
    if (game.gameStep == GameStep.GUESS) {
      const numberOfPlayers = this.getInGamePlayers().length;
      const numberOfSelectedDefinitions = Object.keys(game.selections).length;
      if (numberOfSelectedDefinitions == numberOfPlayers) {
        game.goToNextStep(room.gameSettings);
      }
    }
    room.updateClient(io);
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

    //delete room if he was the last one
    const remaningInGamePlayers = this.getInGamePlayers();
    if (remaningInGamePlayers.length === 0) {
      setTimeout(async () => {
        if (this.getInGamePlayers().length === 0)
          roomStore.deleteRoom(room.roomId);
      }, ROOM_DELETE_DELAY);
      return;
    }

    //set him out of the game
    setTimeout(() => {
      if (player.isConnected) return;
      player.isInGame = false;
      const remaningInGamePlayers = room.players.getInGamePlayers();
      if (player.isAdmin && remaningInGamePlayers.length > 0) {
        remaningInGamePlayers[0].isAdmin = true;
        console.log('new Admin', remaningInGamePlayers[0].username);
      }
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
        const numberOfSelectedDefinitions = Object.keys(game.selections).length;
        if (numberOfSelectedDefinitions == numberOfPlayers) {
          game.goToNextStep(room.gameSettings);
        }
      }
      room.updateClient(io);
    }, DISCONNECT_FROM_GAME_DELAY);
  }

  onPlayerRejoinRoom(userId: UserId) {
    const player = this.getOnePlayer(userId);
    if (!player) return;
    player.isConnected = true;
    player.isInGame = true;
  }
}
