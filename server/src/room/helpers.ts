import { RemoteSocket, Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Game } from '../game/gameManager';
import { GameStep } from '../game/types';
import { GAME_DELETE_DELAY } from '../socket/constants';
import { InMemoryGameStore } from '../socket/gameStore';
import { MAX_PLAYER_IN_ROOM } from './constants';
import { ConnectedPlayer, GamePlayer, RoomId } from './types';

export const getSocketRoom = (socket: Socket) =>
  Array.from(socket.rooms.values()).filter(
    (roomId) => roomId !== socket.id
  )?.[0];

export const getConnectedPlayers = async (io: Server, roomId: string) => {
  const playerSockets = await io.in(roomId).fetchSockets();
  return playerSockets.map((socket) => {
    const connectedPlayer: ConnectedPlayer = {
      socketId: socket.id,
      userId: socket.data?.userId,
    };
    return connectedPlayer;
  });
};

export const checkIfRoomExists = (io: Server, roomId: string) => {
  const serverRooms = Array.from(io.sockets.adapter.rooms.keys());
  return serverRooms.includes(roomId);
};

export const selectColor = (players: GamePlayer[]) => {
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
  game: Game,
  socketId: string,
  roomId: string
) => {
  const gamePlayers = game.gamePlayers;
  const otherGamePlayers = gamePlayers.filter(
    (player) => player.socketId != socketId
  );
  if (otherGamePlayers.length === 0) return;
  const newAdminPlayer = otherGamePlayers[0];
  game.adminPlayer = newAdminPlayer;
  game.gamePlayers = gamePlayers.map((player) => {
    if (player.socketId === newAdminPlayer.socketId) player.isAdmin = true;
    return player;
  });
  console.log(`${newAdminPlayer} is the new admin of the room ${roomId}`);
};

export const onLeavingRoom = async (
  io: Server,
  socket: Socket,
  roomId: string,
  gameStore: InMemoryGameStore
) => {
  const playersLeft = (await getConnectedPlayers(io, roomId)).filter(
    (player) => player?.socketId != socket.id
  );
  if (playersLeft.length === 0) {
    setTimeout(async () => {
      //in order to let the admin reconnect if he is the only one left
      if ((await getConnectedPlayers(io, roomId)).length === 0)
        gameStore.deleteGame(roomId);
    }, GAME_DELETE_DELAY);
    return;
  }
  if (socket.data?.isAdmin) {
    const game = gameStore.getGame(roomId);
    if (!game) return playersLeft;
    return await selectNewAdmin(game, socket.id, roomId);
  }
  return playersLeft;
};

export const canJoinRoom = async (
  io: Server,
  socket: Socket,
  roomId: RoomId,
  gameStore: InMemoryGameStore
) => {
  const game = gameStore.getGame(roomId);
  if (!game) return [false, "Room's game not found"];
  // Room does not exist
  if (!checkIfRoomExists(io, roomId)) {
    //Room was deleted after last person's departure but the game still exist
    if (game) {
      socket.data.isAdmin = true;
      return [true, ''];
    }
    return [false, 'Room do not exist'];
  }

  // Room already full
  const otherRoomPlayers = await getConnectedPlayers(io, roomId);
  if (otherRoomPlayers.length >= MAX_PLAYER_IN_ROOM) {
    return [false, `Room size limited to ${MAX_PLAYER_IN_ROOM} players`];
  }

  // Bug and Socket did not left his last room
  const socketOtherRooms = Array.from(socket.rooms.values()).filter(
    (room) => room != roomId && room != socket.id
  );
  if (socketOtherRooms.length > 0) {
    return [
      false,
      'Already in annother room, hard refresh your browser window',
    ];
  }

  // The game is already launched and he was not part of it
  if (
    game &&
    game.gameStep !== GameStep.WAIT &&
    socket.data?.session?.roomId !== roomId
  ) {
    return [false, 'Game already in play'];
  }
  return [true, ''];
};

export const createPlayerForSocket = (
  socket: Socket,
  username: string,
  otherPlayers: GamePlayer[],
  isAdmin: boolean = false
) => {
  return {
    socketId: socket.id,
    userId: socket.data.userId,
    username,
    color: selectColor(otherPlayers),
    isAdmin,
  };
};

export const applySessionSaved = (socket: Socket) => {
  socket.data.username = socket.data?.session?.username;
  socket.data.color = socket.data?.session?.color;
  delete socket.data.session;
};
