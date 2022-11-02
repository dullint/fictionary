import { GameSettings } from '../game/types';

export interface Player {
  socketId: string;
  username: string;
  color: string;
  isAdmin: boolean;
}
export interface UpdateUsernamePayload {
  roomId: string;
  username: string;
}

export interface createRoomPayload {
  roomId: string;
  gameSettings: GameSettings;
}
