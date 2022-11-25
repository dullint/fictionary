import { io } from 'socket.io-client';

declare module 'socket.io-client' {
  interface Socket {
    userId: string;
  }
}

const server =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3020'
    : 'https://sea-lion-app-w7b99.ondigitalocean.app/';
const socket = io(server, { autoConnect: false, forceNew: true });
const sessionId = localStorage.getItem('fictionarySessionId');
socket.auth = { sessionId };
socket.connect();

export default socket;
