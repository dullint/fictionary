import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';
import dictionary from './dictionary';
import setupServer from './socket';
import logger from './logging';
import { SocketManager } from './SocketManager';

const app = express();
app.use(cors());
const server = http.createServer(app);
const port = process.env.PORT || 3020;
const io = setupServer(server);

export const socketManager = SocketManager.getInstance(io);

if (process.env.NODE_ENV !== 'development') {
  app.use(express.static(path.resolve(__dirname, '../../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build/index.html'));
  });
}

dictionary.setUp().then(() => {
  server.listen(port, () =>
    logger.info(`[SET UP] SERVER IS RUNNING ON PORT ${port}`)
  );
});
