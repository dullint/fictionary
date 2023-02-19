import { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '../../server/src/socket/types';

const serverAddress =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3020/'
    : 'https://fictionary.io/';

export type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export var localSocketUserId = localStorage.getItem('fictionaryUserId');
if (!localSocketUserId) {
  localSocketUserId = uuidv4();
  localStorage.setItem('fictionaryUserId', localSocketUserId);
}

const connectSocket = (serverAddress: string, userId: string): ClientSocket => {
  const socket = io(serverAddress, {
    autoConnect: false,
    forceNew: true,
  });
  socket.auth = { userId };
  socket.connect();
  return socket;
};

export default connectSocket(serverAddress, localSocketUserId);
