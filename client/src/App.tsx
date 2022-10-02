import React, { createContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Room from './components/Room';
import CreateRoom from './components/CreateGame';
import { io, Socket } from 'socket.io-client';

export const SocketContext = createContext(null);

const App = () => {
  const [socket, setSocket] = useState<Socket>(null);

  useEffect(() => {
    const server = 'http://localhost:3021';
    const socket = io(server);
    setSocket(socket);
  }, []);

  return (
    <div className="App">
      <SocketContext.Provider value={socket}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/create-room" element={<CreateRoom />} />
          <Route path="/room/:roomId" element={<Room />} />
        </Routes>
      </SocketContext.Provider>
    </div>
  );
};

export default App;
