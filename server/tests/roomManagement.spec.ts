import { createServer } from 'http';
import { Server } from 'socket.io';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';
import roomStore from '../src/room/roomStore';
import server from '../src/socket';
import { ServerResponse, ServerSocket } from '../src/socket/types';
import { expect } from 'chai';
import { Room } from '../src/room';
import { testConnectSocket, testCreateRoom, testJoinRoom } from './roomHelpers';
import { JoinRoomError } from '../src/handler/errors';

describe('Room connection management', () => {
  let io: Server, serverSocket: ServerSocket;
  const httpServer = createServer();
  const port = 3000;
  const roomId = 'TESTS';
  const serverAdress = `http://localhost:${port}`;

  beforeEach((done) => {
    io = server(httpServer);
    httpServer.listen(port, () => {
      const socket = testConnectSocket(serverAdress, 'TEST_USER_ID');
      io.on('connection', (socket) => {
        serverSocket = socket;
      });
      socket.on('connect', done);
    });
  });

  afterEach((done) => {
    io.close();
    done();
  });

  it('Should create a default room when called', async () => {
    const socket = testConnectSocket(serverAdress, 'USER_ID');
    const success = await testCreateRoom(socket, roomId);
    expect(success).to.be.true;
    expect(roomStore.get(roomId)).to.deep.equal(new Room(roomId));
  });

  it('Should join a room after having created it', async () => {
    const socket = testConnectSocket(serverAdress, 'USER_ID');
    socket.emit('create_room', roomId, (_: ServerResponse) => {});
    const clientRoom = await testJoinRoom(socket, roomId);
    expect(clientRoom).to.deep.equal(roomStore.get(roomId)?.getRoomClient());
    expect(clientRoom.players[0].isAdmin).to.be.true;
  });

  it('Should get a join room error when the roomId does not exist', async () => {
    const socket = testConnectSocket(serverAdress, 'USER_ID');
    await testJoinRoom(socket, 'DOES_NOT_EXIST').catch((err) =>
      expect(err).to.equal(JoinRoomError.roomNotFound)
    );
  });

  it('Should be able to reconnect to a room', async () => {
    const socket = testConnectSocket(serverAdress, 'USER_ID');
    socket.emit('create_room', roomId, (_: ServerResponse) => {});
    const clientRoom = await testJoinRoom(socket, roomId);
    socket.emit('disconnect', roomId, (_: ServerResponse) => {});
  });
});
