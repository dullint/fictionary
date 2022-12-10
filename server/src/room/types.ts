import { GameSettings } from '../game/types';
import { UserId } from '../socket/sessionStore';

export type RoomId = string;

export interface Player {
  socketId: string;
  userId: UserId;
  username?: string;
  color: string;
  isAdmin: boolean;
}
export interface UpdateUsernamePayload {
  roomId: string;
  username: string;
}

export interface CreateRoomPayload {
  roomId: string;
  gameSettings: GameSettings;
}
