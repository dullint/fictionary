import { Server, Socket } from 'socket.io';
import { getPlayers, getSocketRoom } from '../room/helpers';

import { getGame, get_random_word, updateGame } from './helpers';
import GAMES, { Game } from './games';
import { DictionnaryEntry } from './types';

export const gameHandler = (io: Server, socket: Socket) => {
  const beginGame = () => {
    const game = getGame(socket);
    if (!game) return;
    console.log(`User ${socket.id} begun game`);
    game.goToNextStep();
    updateGame(io, socket, game);
    getWord();
  };

  const getWord = () => {
    const game = getGame(socket);
    if (!game) return;
    const word = get_random_word();
    game.updateEntry(word);
    updateGame(io, socket, game);
  };

  const submitDefinition = async ({ entry }: { entry: DictionnaryEntry }) => {
    const { word, definition } = entry;
    const game = getGame(socket);
    if (!game) return;
    game.addDefinition(socket.id, definition);
    const roomId = getSocketRoom(socket);
    const numberOfPlayers = (await getPlayers(io, roomId)).length;
    const numberOfDefinitions = Object.keys(game.definitions).length;
    if (numberOfDefinitions == numberOfPlayers) {
      game.goToNextStep();
      updateGame(io, socket, game);
    }
  };

  const queryGame = () => {
    const game = getGame(socket);
    if (!game) return;
    updateGame(io, socket, game);
  };

  const selectDefinition = async ({ socketId }: { socketId: string }) => {
    const game = getGame(socket);
    if (!game) return;
    const roomId = getSocketRoom(socket);
    game.selectDefinition(socket.id, socketId);
    const numberOfPlayers = (await getPlayers(io, roomId)).length;
    const numberOfSelectedDefinitions = Object.keys(game.selections).length;
    if (numberOfSelectedDefinitions == numberOfPlayers) {
      game.goToNextStep();
      updateGame(io, socket, game);
    }
  };

  socket.on('get_new_word', getWord);
  socket.on('begin_game', beginGame);
  socket.on('submit_definition', submitDefinition);
  socket.on('game', queryGame);
  socket.on('select_definition', selectDefinition);
};
