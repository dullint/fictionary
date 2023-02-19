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

const socket: ClientSocket = io(serverAddress, {
  autoConnect: false,
  forceNew: true,
});
export var localSocketUserId = localStorage.getItem('fictionaryUserId');
if (!localSocketUserId) {
  localSocketUserId = uuidv4();
  localStorage.setItem('fictionaryUserId', localSocketUserId);
}
socket.auth = { userId: localSocketUserId };
socket.connect();

export default socket;
