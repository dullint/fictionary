import { Server, Socket } from 'socket.io';
import { Player } from './types';

export const getSocketRoom = (socket: Socket) =>
  Array.from(socket.rooms.values()).filter(
    (roomId) => roomId !== socket.id
  )?.[0];

export const getPlayers = async (io: Server, roomId: string) => {
  const playerSockets = await io.in(roomId).fetchSockets();
  return playerSockets.map((socket) => {
    const player: Player = {
      socketId: socket.id,
      username: socket.data?.username,
      color: socket.data?.color,
      isAdmin: socket.data?.isAdmin,
    };
    return player;
  });
};

export const checkIfRoomExists = (io: Server, roomId: string) => {
  const serverRooms = Array.from(io.sockets.adapter.rooms.keys());
  return serverRooms.includes(roomId);
};

export const generateInviteUsername = () => {
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
