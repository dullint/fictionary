import { RoomError, UpdateUsernameError } from '../handler/errors';
import { ClientRoom, GameSettings, RoomId } from '../room/types';
import { Socket } from 'socket.io';
import { Username, Scores } from '../room/types';
import { Client } from 'socket.io/dist/client';

export type UserId = string;
export interface SocketData {
  userId: UserId;
}

export type RoomIdPayload = { roomId: RoomId };

export type ServerSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData
>;

export type ServerResponse = { success: boolean; error?: string };
export type EventCallback = (response: ServerResponse) => void;

export interface ServerToClientEvents {
  //get room
  room_error: (error: RoomError) => void;

  //update username
  username_updated: () => void;
  update_username_error: (error: UpdateUsernameError) => void;

  //update timer
  timer: (counter: number) => void;
  show_next_def: (index: number) => void;

  //update room to client
  room: (room: ClientRoom) => void;
}

export interface ClientToServerEvents {
  //in Home
  create_room: (roomId: RoomId, callback: EventCallback) => void;
  join_room: (roomId: RoomId, callback: EventCallback) => void;

  //in waiting room
  leave_room: (payload: RoomIdPayload) => void;
  update_username: (username: Username, callback: EventCallback) => void;
  room_joined: () => void;
  change_game_settings: (gameSettings: GameSettings) => void;
  launch_game: (payload: RoomIdPayload) => void;

  // *** In game
  //in Prompt
  get_new_word: () => void;
  submit_definition: (payload: SubmitDefinitionPayload) => void;
  remove_definition: () => void;
  show_results: () => void;

  //in guess
  update_scores: (scores: Scores) => void;

  //in result
  new_round: (payload: RoomIdPayload) => void;
  reset_game: (payload: RoomIdPayload) => void;
  select_definition: (selectedUserId: UserId) => void;
}

export interface SubmitDefinitionPayload {
  definition: string;
  example: string;
  autosave: boolean;
}
