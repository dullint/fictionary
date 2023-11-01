import { Server, Socket } from 'socket.io';
import { gameController } from '../controllers/gameController'; // Import the game controller

// Define the game socket event handlers
export const handleGameEvents = (socket: Socket) => {
  socket.on('createGame', (gameId: string) => {
    gameController.createGame(gameId);
    // Emit events or perform other actions as needed
  });

  socket.on('getGame', (gameId: string) => {
    const game = gameController.getGame(gameId);
    // Emit events or perform other actions with the retrieved game data
  });
};
