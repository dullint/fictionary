import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';
import dictionary from './dictionary';
import io from './socket';
import logger from './logging';

const app = express();
app.use(cors());
if (process.env.NODE_ENV !== 'development') {
  app.use(express.static(path.resolve(__dirname, '../../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build/index.html'));
  });
}

dictionary.setUp().then(() => {
  const server = http.createServer(app);
  const port = process.env.PORT || 3020;
  io(server);
  server.listen(port, () =>
    logger.info(`[SET UP] SERVER IS RUNNING ON PORT ${port}`)
  );
});
