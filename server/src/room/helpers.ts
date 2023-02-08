import { RemoteSocket, Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { GameStep } from '../game/types';
import { GameStore } from '../game/gameStore';
import { MAX_PLAYER_IN_ROOM } from './constants';
import { RoomId } from './types';
import { JoinRoomError } from './errors';

export const getSocketRoom = (socket: Socket) =>
  Array.from(socket.rooms.values()).filter(
    (roomId) => roomId !== socket.id
  )?.[0];
