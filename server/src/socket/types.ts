import { Username } from '../player/type';
import { JoinRoomError } from '../room/errors';
import { RoomId } from '../room/types';

export type UserId = string;
export interface SocketData {
  userId: UserId;
}

export type RoomIdPayload = { roomId: RoomId };

export type UpdateUsernamePayload = RoomIdPayload & {
  username: Username;
};

export interface ServerToClientEvents {
  room_joined: () => void;
  join_room_error: (type: JoinRoomError) => void;
  room_created: () => void;
  username_updated: () => void;
  update_username_error: () => void;
}

export interface ClientToServerEvents {
  update_username: (payload: UpdateUsernamePayload) => void;
  create_room: (payload: RoomIdPayload) => void;
  join_room: (payload: RoomIdPayload) => void;
  leave_room: (payload: RoomIdPayload) => void;
  onDisconnect: (payload: RoomIdPayload) => void;
  players: () => void;
  room_joined: () => void;
  join_room_error: (message: string) => void;
  room_created: () => void;
  username_updated: () => void;
  update_username_error: () => void;
}
