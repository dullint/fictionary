import { CreateRoomPayload, UpdateUsernamePayload } from '../room/types';
import { Session, UserId } from './sessionStore';

export interface SocketData {
  userId: UserId;
  session: Session;
  color: string;
  username: string;
  isAdmin: boolean;
}

export interface ServerToClientEvents {
  room_joined: () => void;
  join_room_error: (message: string) => void;
  room_created: () => void;
  username_updated: () => void;
  update_username_error: () => void;
}

export interface ClientToServerEvents {
  update_username: (payload: UpdateUsernamePayload) => void;
  create_room: (payload: CreateRoomPayload) => void;
  join_room: ({ roomId }: { roomId: string }) => void;
  leave_room: ({ roomId }: { roomId: string }) => void;
  players: () => void;
  disconnecting: () => void;
  room_joined: () => void;
  join_room_error: (message: string) => void;
  room_created: () => void;
  username_updated: () => void;
  update_username_error: () => void;
}
