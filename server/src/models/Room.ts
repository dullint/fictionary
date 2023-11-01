import { Player } from './Player'; // Import the Player model if needed
import { GameState } from './Game'; // Import the GameState model if needed

export type RoomId = string;

// Define the structure and types for the Room model
export interface Room {
  roomId: RoomId;
  players: Player[];
  gameState: GameState | null;
  // Add other properties related to the room
}

// Implement the Room class with necessary methods and properties
export class RoomModel implements Room {
  roomId: RoomId;
  players: Player[];
  gameState: GameState | null;
  // Add other properties related to the room

  constructor(roomId: string /* Add other necessary parameters */) {
    this.roomId = roomId;
    this.players = [];
    this.gameState = null;
  }

  // Implement methods to manage the room, players, and game state
  addPlayer(player: Player) {
    this.players.push(player);
  }

  removePlayer(userId: string) {
    this.players = this.players.filter((player) => player.userId !== userId);
  }

  updateGameState(newState: GameState) {
    this.gameState = newState;
  }
}
