import { Scores, SelectedDefinitions } from '../game/types';
import { Username } from '../player/type';
import { JoinRoomError } from '../room/errors';
import { GameSettings, RoomId } from '../room/types';

export type UserId = string;
export interface SocketData {
  userId: UserId;
}

export type RoomIdPayload = { roomId: RoomId };

export interface ServerToClientEvents {
  room_joined: () => void;
  join_room_error: (type: JoinRoomError) => void;
  room_error: (message: string) => void;
  room_created: () => void;
  username_updated: () => void;
  update_username_error: () => void;
  timer: (counter: number) => void;
}

export interface ClientToServerEvents {
  update_username: (payload: { username: Username }) => void;
  create_room: (payload: RoomIdPayload) => void;
  join_room: (payload: RoomIdPayload) => void;
  leave_room: (payload: RoomIdPayload) => void;
  onDisconnect: (payload: RoomIdPayload) => void;
  players: () => void;
  room_joined: () => void;
  join_room_error: (message: string) => void;
  room_created: () => void;
  launch_game: (payload: RoomIdPayload) => void;
  username_updated: () => void;
  update_username_error: () => void;
  update_scores: ({ roomId, scores }: UpdateScoresPayload) => void;
  newRound: (payload: RoomIdPayload) => void;
  show_results: () => void;
  submit_definition: (payload: SubmitDefinitionPayload) => void;
  remove_definition: (payload: RemoveDefinition) => void;
  new_round: (payload: RoomIdPayload) => void;
  reset_game: (payload: RoomIdPayload) => void;
  select_definition: (payload: SelectDefinitionPayload) => void;
  get_new_word: () => void;
  change_game_settings: (payload: ChangeGameSettingsPayload) => void;
}

export interface UpdateScoresPayload {
  roomId: RoomId;
  scores: Scores;
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
