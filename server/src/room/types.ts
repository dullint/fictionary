import { GameSettings } from '../game/types';
import { UserId } from '../socket/sessionStore';

export type RoomId = string;

export interface ConnectedPlayer {
  socketId: string;
  userId: UserId;
}

export interface GamePlayer extends ConnectedPlayer {
  username: string;
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
