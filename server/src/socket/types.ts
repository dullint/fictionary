import {
  CreateRoomError,
  JoinRoomError,
  RoomError,
  UpdateUsernameError,
} from '../handler/errors';
import { ClientRoom, GameSettings, RoomId } from '../room/types';
import { Socket as DefaultSocket } from 'socket.io';
import { Username, Scores } from '../room/types';

export type UserId = string;
export interface SocketData {
  userId: UserId;
}

export type RoomIdPayload = { roomId: RoomId };

export type Socket = DefaultSocket<
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData
>;

export interface ServerToClientEvents {
  //join room
  join_room_error: (error: JoinRoomError) => void;
  room_joined: (room: ClientRoom) => void;

  //get room
  room_existence: (existence: boolean) => void;
  room_error: (error: RoomError) => void;

  //create room
  room_created: () => void;
  create_room_error: (error: CreateRoomError) => void;

  //update username
  username_updated: () => void;
  update_username_error: (error: UpdateUsernameError) => void;

  //update timer
  timer: (counter: number) => void;

  //update room to client
  room: (room: ClientRoom) => void;
}

export interface ClientToServerEvents {
  //in Home
  check_room_existence: (payload: RoomIdPayload) => void;
  create_room: (payload: RoomIdPayload) => void;
  join_room: (payload: RoomIdPayload) => void;

  //in waiting room
  leave_room: (payload: RoomIdPayload) => void;
  update_username: (payload: UpdateUsernamePayload) => void;
  room_joined: () => void;
  change_game_settings: (payload: ChangeGameSettingsPayload) => void;
  launch_game: (payload: RoomIdPayload) => void;

  // *** In game
  //in Prompt
  get_new_word: () => void;
  submit_definition: (payload: SubmitDefinitionPayload) => void;
  remove_definition: (payload: RemoveDefinition) => void;
  show_results: () => void;

  //in guess
  update_scores: (payload: UpdateScoresPayload) => void;

  //in result
  new_round: (payload: RoomIdPayload) => void;
  reset_game: (payload: RoomIdPayload) => void;
  select_definition: (payload: SelectDefinitionPayload) => void;
}

export interface UpdateScoresPayload {
  roomId: RoomId;
  scores: Scores;
}

export interface UpdateUsernamePayload {
  username: Username;
}

export interface ChangeGameSettingsPayload {
  gameSettings: GameSettings;
}
export interface SelectDefinitionPayload {
  userId: UserId;
}

export interface RemoveDefinition {
  roomId: RoomId;
  word: string;
}

export interface SubmitDefinitionPayload {
  definition: string;
  example: string;
  autosave: boolean;
}
