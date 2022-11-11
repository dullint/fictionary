import { RemoteSocket, Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import GAMES from '../game/gameManager';
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

const generateInviteUsername = () => {
  const random_number = Math.floor(Math.random() * 10000) + 1;
  return `Invite-${random_number}`;
};

export const checkIfUsernameTaken = async (
  io: Server,
  roomId: string,
  username: string
) => {
  const players = await getPlayers(io, roomId);
  const roomUsernames = players.map((player) => player.username);
  return roomUsernames.includes(username);
};

export const selectColor = (n: number) => {
  const hue = n * 137.508; // use golden angle approximation
  return `hsl(${hue},100%,75%)`;
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
  roomId: string
) => {
  const playersLeft = (await getPlayers(io, roomId)).filter(
    (player) => player.socketId != socket.id
  );
  if (playersLeft.length === 0) {
    GAMES.delete(roomId);
    console.log(`Game of room ${roomId} deleted`);
    return;
  }
  const updatedPlayersLeft = socket.data?.isAdmin
    ? await selectNewAdmin(io, socket.id, roomId)
    : playersLeft;
};
