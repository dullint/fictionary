import { UserId } from '../socket/types';

export type Username = string;
export type Color = string;
export interface Player {
  username?: Username;
  color: Color;
  userId: UserId;
  //   isConnected: boolean;
  //   isInGame: boolean;
  isAdmin: boolean;
}

export class PlayerModel implements Player {
  userId: UserId;
  username?: Username;
  color: Color;
  //   isConnected: boolean;
  //   isInGame: boolean;
  isAdmin: boolean;

  constructor(userId: UserId, isAdmin: boolean = false) {
    this.userId = userId;
    this.username = undefined;
    this.color = '';
    this.isAdmin = isAdmin;
  }
}
