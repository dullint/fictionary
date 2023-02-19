import { createServer } from 'http';
import { Server } from 'socket.io';
import roomStore from '../src/room/roomStore';
import server from '../src/socket';
import { ServerResponse, ServerSocket } from '../src/socket/types';
import { expect } from 'chai';
import { Room } from '../src/room';
import {
  connectSocket,
  createRoom,
  joinRoom,
  roomUpdate,
  wait,
} from './helpers';
import { JoinRoomError } from '../src/handler/errors';
import { ClientRoom, Player } from '../src/room/types';
import { DISCONNECT_FROM_GAME_DELAY } from '../src/room/constants';

describe('Room connection management', () => {
  let io: Server, serverSocket: ServerSocket;
  const httpServer = createServer();
  const port = 3000;
  const roomId = 'TESTS';
  const serverAdress = `http://localhost:${port}`;

  beforeEach(() => {
    io = server(httpServer);
    httpServer.listen(port, () => {
      connectSocket(serverAdress, 'TEST_USER_ID');
      io.on('connection', (socket) => {
        serverSocket = socket;
      });
    });
  });

  afterEach((done) => {
    roomStore.clear();
    io.close();
    done();
  });

  it('Should create a default room when called', async () => {
    const socket = connectSocket(serverAdress, 'USER_ID');
    const success = await createRoom(socket, roomId);
    expect(success).to.be.true;
    expect(roomStore.get(roomId)).to.deep.equal(new Room(roomId));
  });

  it('Should join a room after having created it', async () => {
    const socket = connectSocket(serverAdress, 'USER_ID');
    socket.emit('create_room', roomId, (_: ServerResponse) => {});
    const clientRoom = await joinRoom(socket, roomId);
    expect(clientRoom).to.deep.equal(roomStore.get(roomId)?.getRoomClient());
    expect(clientRoom.players[0].isAdmin).to.be.true;
  });

  it('Should get a join room error when the roomId does not exist', async () => {
    const socket = connectSocket(serverAdress, 'USER_ID');
    await joinRoom(socket, 'DOES_NOT_EXIST').catch((err) =>
      expect(err).to.equal(JoinRoomError.roomNotFound)
    );
  });

  it('Should be able to reconnect to a room without being out of the game', async () => {
    const socketUser1 = connectSocket(serverAdress, 'USER_ID_1');
    const socketUser2 = connectSocket(serverAdress, 'USER_ID_2');
    socketUser2.emit('create_room', roomId, (_: ServerResponse) => {});

    let clientRoomUser2 = await joinRoom(socketUser2, roomId);
    await joinRoom(socketUser1, roomId);
    clientRoomUser2 = await new Promise<ClientRoom>(async (rs, _) => {
      socketUser1.disconnect();
      socketUser2.on('room', (room: ClientRoom) => {
        rs(room);
      });
    });
    let player1 = clientRoomUser2.players.find(
      (player) => player.userId === 'USER_ID_1'
    );
    expect(player1?.isConnected).to.be.false;
    expect(player1?.isInGame).to.be.true;

    socketUser1.connect();
    clientRoomUser2 = await joinRoom(socketUser1, roomId, socketUser2);
    player1 = clientRoomUser2.players.find(
      (player) => (player.userId = 'USER_ID_1')
    );
    expect(player1?.isConnected).to.be.true;
    expect(player1?.isInGame).to.be.true;
  });

  it('Should be able to reconnect to a room after having ejected from a game', async () => {
    const socketUser1 = connectSocket(serverAdress, 'USER_ID_1');
    const socketUser2 = connectSocket(serverAdress, 'USER_ID_2');
    socketUser2.emit('create_room', roomId, (_: ServerResponse) => {});

    let clientRoomUser2 = await joinRoom(socketUser2, roomId);
    await joinRoom(socketUser1, roomId);

    clientRoomUser2 = await new Promise<ClientRoom>(async (rs, rj) => {
      socketUser1.disconnect();
      socketUser2.on('room', (room: ClientRoom) => {
        rs(room);
      });
    });
    let player1 = clientRoomUser2.players.find(
      (player) => player.userId === 'USER_ID_1'
    );
    expect(player1?.isConnected).to.be.false;
    expect(player1?.isInGame).to.be.true;

    clientRoomUser2 = await new Promise<ClientRoom>(async (rs, rj) => {
      socketUser2.on('room', (room: ClientRoom) => {
        rs(room);
      });
      await wait(DISCONNECT_FROM_GAME_DELAY);
      rj(false);
    });
    player1 = clientRoomUser2.players.find(
      (player) => player.userId === 'USER_ID_1'
    );
    expect(player1).to.be.undefined;

    socketUser1.connect();
    clientRoomUser2 = await joinRoom(socketUser1, roomId, socketUser2);
    player1 = clientRoomUser2.players.find(
      (player) => (player.userId = 'USER_ID_1')
    );
    expect(player1?.isConnected).to.be.true;
    expect(player1?.isInGame).to.be.true;
  }).timeout(DISCONNECT_FROM_GAME_DELAY + 1000);
});
