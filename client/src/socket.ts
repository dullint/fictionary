import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const server =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3020'
    : 'https://fictionary.io/';
const socket = io(server, { autoConnect: false, forceNew: true });
var userId = localStorage.getItem('fictionaryUserId');
if (!userId) {
  userId = uuidv4();
  localStorage.setItem('fictionaryUserId', userId);
}
socket.auth = { userId };
socket.connect();

export default socket;
