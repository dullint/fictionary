import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';
import dictionary from './dictionary';
import io from './socket';

const app = express();
app.use(cors());
if (process.env.NODE_ENV !== 'development') {
  app.use(express.static(path.resolve(__dirname, '../../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build/index.html'));
  });
}

dictionary.parseDatabase().then(() => {
  const server = http.createServer(app);
  const port = process.env.PORT || 3020;
  io(server);
  server.listen(port, () => console.log(`SERVER IS RUNNING ON PORT ${port}`));
});
