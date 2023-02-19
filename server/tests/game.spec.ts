import { createServer } from 'http';
import { Server } from 'socket.io';
import { ServerSocket } from '../src/socket/types';
import server from '../src/socket';
import { connectSocket, createRoom } from './helpers';
import { expect } from 'chai';

describe('Game Example', () => {
  let io: Server, serverSocket: ServerSocket;
  const httpServer = createServer();
  const port = 3001;
  const roomId = 'TESTS';
  const serverAdress = `http://localhost:${port}`;
  io = server(httpServer);
  httpServer.listen(port, () => {
    connectSocket(serverAdress, 'TEST_USER_ID');
    io.on('connection', (socket) => {
      serverSocket = socket;
    });
  });

  let socketUser1 = connectSocket(serverAdress, 'USER_ID');
  let socketUser2 = connectSocket(serverAdress, 'USER_ID');
  let socketUser3 = connectSocket(serverAdress, 'USER_ID');
  let socketUser4 = connectSocket(serverAdress, 'USER_ID');

  it('should be able to create one room', async () => {
    const success = await createRoom(socketUser1, roomId);
    expect(success).to.be.true;
  });
});
