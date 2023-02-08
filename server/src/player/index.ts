import { UserId } from '../socket/types';
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

  updateUsername(username: Username) {
    this.username = username;
  }

  onDisconnect() {
    this.isConnected = false;
    setTimeout(() => {
      if (this.isConnected) this.isInGame = false;
    });
  }

  onConnect() {
    this.isConnected = false;
    this.isInGame = true;
  }
}