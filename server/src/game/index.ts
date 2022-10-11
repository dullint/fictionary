import { Server, Socket } from 'socket.io';
import { getPlayers, getSocketRoom } from '../room/helpers';

import { get_random_entry, runTimer } from './helpers';
import GAMES, { Game } from './games';
import { DictionnaryEntry, GameStep, Scores } from './types';

export const gameHandler = (io: Server, socket: Socket) => {
  const submitDefinition = async ({ definition }: { definition: string }) => {
    const roomId = getSocketRoom(socket);
    const game = GAMES.get(roomId);
    if (!game) return;
    game.definitions[socket.id] = definition;
    const numberOfPlayers = (await getPlayers(io, roomId)).length;
    const numberOfDefinitions = Object.keys(game.definitions).length;
    if (numberOfDefinitions == numberOfPlayers) {
      game.gameStep = GameStep.GUESS;
      io.to(roomId).emit('game', game);
    }
  };

  const removeDefinition = () => {
    const roomId = getSocketRoom(socket);
    const game = GAMES.get(roomId);
    if (!game) return;
    delete game.definitions[socket.id];
  };

  const queryGame = () => {
    const roomId = getSocketRoom(socket);
    const game = GAMES.get(roomId);
    if (!game) return;
    io.to(roomId).emit('game', game);
  };

  const selectDefinition = async ({ socketId }: { socketId: string }) => {
    const roomId = getSocketRoom(socket);
    const game = GAMES.get(roomId);
    if (!game) return;
    game.selections[socket.id] = socketId;
    const numberOfPlayers = (await getPlayers(io, roomId)).length;
    const numberOfSelectedDefinitions = Object.keys(game.selections).length;
    if (numberOfSelectedDefinitions == numberOfPlayers) {
      game.gameStep = GameStep.RESULTS;
      io.to(roomId).emit('game', game);
    }
  };

  const updateScores = ({ scores }: { scores: Scores }) => {
    const roomId = getSocketRoom(socket);
    const game = GAMES.get(roomId);
    if (!game) return;
    game.scores = scores;
    io.to(roomId).emit('game', game);
  };

  const resetGame = () => {
    const roomId = getSocketRoom(socket);
    const game = GAMES.get(roomId);
    if (!game) return;
    game.reset();
    io.to(roomId).emit('game', game);
  };

  const launchNewRound = () => {
    const roomId = getSocketRoom(socket);
    const game = GAMES.get(roomId);
    if (!game) return;
    if (game.round >= game.gameSettings.roundNumber) {
      game.gameStep = GameStep.FINISHED;
      io.to(roomId).emit('game', game);
    } else {
      game.newRound();
      io.to(roomId).emit('game', game);
      runTimer(io, roomId, game.gameSettings.maxPromptTime, game);
    }
  };

  const getNewWord = () => {
    const roomId = getSocketRoom(socket);
    const game = GAMES.get(roomId);
    if (!game) return;
    const entry = get_random_entry();
    game.entry = entry;
    io.to(roomId).emit('game', game);
    runTimer(io, roomId, game.gameSettings.maxPromptTime, game);
  };

  socket.on('reset_game', resetGame);
  socket.on('update_scores', updateScores);
  socket.on('new_round', launchNewRound);
  socket.on('submit_definition', submitDefinition);
  socket.on('game', queryGame);
  socket.on('select_definition', selectDefinition);
  socket.on('remove_definition', removeDefinition);
  socket.on('get_new_word', getNewWord);
};
