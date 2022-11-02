import { Player } from '../../../../server/src/room/types';

export const isRoomAdmin = (players: Player[], socketId: string) =>
  players.filter((player) => player.socketId === socketId)?.[0]?.isAdmin;
