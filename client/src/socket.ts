import { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '../../server/src/socket/types';

const server =
  process.env.NODE_ENV === 'development'
    ? 'http://192.168.1.24:3020'
    : 'https://fictionary.io/';
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(server, {
  autoConnect: false,
  forceNew: true,
});
var userId = localStorage.getItem('fictionaryUserId');
if (!userId) {
  userId = uuidv4();
  localStorage.setItem('fictionaryUserId', userId);
}
socket.auth = { userId };
socket.connect();

export default socket;
