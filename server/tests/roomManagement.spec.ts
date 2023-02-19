import { createServer } from 'http';
import { Server } from 'socket.io';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';
import roomStore from '../src/room/roomStore';
import server from '../src/socket';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  Socket as ServerSocket,
} from '../src/socket/types';
import { expect } from 'chai';

describe('Room connection management', () => {
  let io: Server,
    serverSocket: ServerSocket,
    clientSocket: ClientSocket<ServerToClientEvents, ClientToServerEvents>;
  const httpServer = createServer();

  beforeEach((done) => {
    const port = 3000;
    io = server(httpServer);
    // Object.keys(roomStore).forEach((roomId) => roomStore.delete(roomId));
    httpServer.listen(port, () => {
      clientSocket = Client(`http://localhost:${port}`);
      io.on('connection', (socket) => {
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
  });

  //   afterEach((done) => {
  //     clientSocket.disconnect();
  //     io.close();
  //     done();
  //   });

  it('Should create a default room when called', async () => {
    let clientReturn = false;
    let createdRoom = null;
    clientSocket.emit('create_room', { roomId: 'TESTS' });
    clientSocket.on('room_created', async () => {
      clientReturn = true;
      createdRoom = await roomStore.get('TESTS');
    });
    expect(clientReturn).to.be.true;
    expect(createdRoom).to.equal(0);
  });
});
