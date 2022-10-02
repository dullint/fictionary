import { Server, Socket } from 'socket.io';
import { getPlayers, getSocketRoom } from '../room/helpers';

import { get_random_word } from './helpers';
import GAMES, { Game } from './games';
import { DictionnaryEntry } from './types';

export const gameHandler = (io: Server, socket: Socket) => {
  const getGame = () => {
    const roomId = getSocketRoom(socket);
    return GAMES.get(roomId);
  };

  const updateGame = (game: Game) => {
    const roomId = getSocketRoom(socket);
    io.to(roomId).emit('game', game);
    console.log(`Game of room ${roomId} updated`);
  };

  const beginGame = () => {
    const game = getGame();
    if (!game) return;
    console.log(`User ${socket.id} begun game`);
    game.goToNextStep();
    updateGame(game);
    getWord();
  };

  const getWord = () => {
    const game = getGame();
    if (!game) return;
    const word = get_random_word();
    game.updateEntry(word);
    updateGame(game);
  };
  const submitDefinition = async (entry: DictionnaryEntry) => {
    const { word, definition } = entry;
    const game = getGame();
    if (!game) return;
    game.addDefinition(socket.id, definition);
    const roomId = getSocketRoom(socket);
    const numberOfPlayers = (await getPlayers(io, roomId)).length;
    const numberOfDefinitions = Object.keys(game.definitions).length;
    console.log({ game, numberOfPlayers, numberOfDefinitions });
    if (numberOfDefinitions == numberOfPlayers) {
      game.goToNextStep();
      updateGame(game);
    }
  };

  const queryGame = () => {
    const game = getGame();
    if (!game) {
      return;
    }
    updateGame(game);
  };

  socket.on('get_new_word', getWord);
  socket.on('begin_game', beginGame);
  socket.on('submit_definition', submitDefinition);
  socket.on('game', queryGame);
};
