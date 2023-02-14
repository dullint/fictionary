import { UserId } from '../socket/types';

export type Username = string;
export type Color = string;

export interface Player {
  username?: Username;
  color: Color;
  userId: UserId;
  isConnected: boolean;
  isInGame: boolean;
  isAdmin: boolean;
}
