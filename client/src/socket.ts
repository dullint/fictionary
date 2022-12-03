import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const server =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3020'
    : 'https://fictionary.io/';
const socket = io(server, { autoConnect: false, forceNew: true });
var sessionId = localStorage.getItem('fictionarySessionId');
if (!sessionId) {
  sessionId = uuidv4();
  localStorage.setItem('fictionarySessionId', sessionId);
}
socket.auth = { sessionId };
socket.connect();

export default socket;
