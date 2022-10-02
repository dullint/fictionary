import { GameSettings } from '../game/types';

export interface Player {
  username: string;
}
export interface UpdateUsernamePayload {
  roomId: string;
  username: string;
}

export interface createRoomPayload {
  roomId: string;
  gameSettings: GameSettings;
}
