import { RemoteSocket, Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { InMemoryGameStore } from '../socket/gameStore';
import { MAX_PLAYER_IN_ROOM } from './constants';
import { Player } from './types';

export const getSocketRoom = (socket: Socket) =>
  Array.from(socket.rooms.values()).filter(
    (roomId) => roomId !== socket.id
  )?.[0];

const getPlayerFromSocket = (
  socket: RemoteSocket<DefaultEventsMap, any>
): Player => {
  return {
    socketId: socket.id,
    username: socket.data?.username,
    color: socket.data?.color,
    isAdmin: socket.data?.isAdmin,
  };
};

export const getPlayers = async (io: Server, roomId: string) => {
  const playerSockets = await io.in(roomId).fetchSockets();
  return playerSockets.map((socket) => getPlayerFromSocket(socket));
};

export const checkIfRoomExists = (io: Server, roomId: string) => {
  const serverRooms = Array.from(io.sockets.adapter.rooms.keys());
  return serverRooms.includes(roomId);
};

export const checkIfUsernameTaken = async (
  io: Server,
  roomId: string,
  username: string
) => {
  const players = await getPlayers(io, roomId);
  const roomUsernames = players.map((player) => player?.username);
  return roomUsernames.includes(username);
};

export const selectColor = (players: Player[]) => {
  const alreadyGivenColors = players.map((player) => player?.color);
  const possibleHues = Array.from(Array(MAX_PLAYER_IN_ROOM).keys()).map(
    (n) => n * 137.508
  );
  const possibleColors = possibleHues.map((hue) => `hsl(${hue},100%,80%)`);
  const shuffledPossibleColors = possibleColors.sort(
    (a, b) => 0.5 - Math.random()
  );
  const newColor =
    shuffledPossibleColors.filter(
      (color) => !alreadyGivenColors.includes(color)
    )?.[0] ?? 'white';
  return newColor;
};

export const selectNewAdmin = async (
  io: Server,
  socketId: string,
  roomId: string
) => {
  const playerSockets = await io.in(roomId).fetchSockets();
  const otherSockets = playerSockets.filter((socket) => socket.id != socketId);
  if (otherSockets.length === 0) return;
  otherSockets[0].data.isAdmin = true;
  console.log(`${otherSockets[0].id} is the new admin of the room ${roomId}`);
  return otherSockets.map((socket) => getPlayerFromSocket(socket));
};

export const onLeavingRoom = async (
  io: Server,
  socket: Socket,
  roomId: string,
  gameStore: InMemoryGameStore
) => {
  const playersLeft = (await getPlayers(io, roomId)).filter(
    (player) => player?.socketId != socket.id
  );
  if (playersLeft.length === 0) {
    gameStore.deleteGame(roomId);
    return;
  }
  return socket.data?.isAdmin
    ? await selectNewAdmin(io, socket.id, roomId)
    : playersLeft;
};
