import { Server, Socket } from 'socket.io';
import { getPlayers, getSocketRoom } from '../room/helpers';

import GAMES from './gameManager';
import { GameSettings, GameStep, Scores } from './types';

export const gameHandler = (io: Server, socket: Socket) => {
  const submitDefinition = async ({
    definition,
    example,
  }: {
    definition: string;
    example: string;
  }) => {
    const roomId = getSocketRoom(socket);
    const game = GAMES.get(roomId);
    if (!game) return;
    game.inputEntries[socket.data.username] = { definition, example };
    const numberOfPlayers = (await getPlayers(io, roomId)).length;
    const numberOfDefinitions = Object.keys(game.inputEntries).length;
    if (numberOfDefinitions == numberOfPlayers) {
      game.goToNextStep();
    }
    io.to(roomId).emit('game', game.info());
  };

  const removeDefinition = () => {
    const roomId = getSocketRoom(socket);
    const game = GAMES.get(roomId);
    if (!game) return;
    game.removeDefinition(socket.data.username);
    io.to(roomId).emit('game', game.info());
  };

  const queryGame = () => {
    const roomId = getSocketRoom(socket);
    const game = GAMES.get(roomId);
    if (!game) return;
    io.to(roomId).emit('game', game.info());
  };

  const selectDefinition = async ({ username }: { username: string }) => {
    const roomId = getSocketRoom(socket);
    const game = GAMES.get(roomId);
    if (!game) return;
    game.selections[socket.data.username] = username;
    const numberOfPlayers = (await getPlayers(io, roomId)).length;
    const numberOfSelectedDefinitions = Object.keys(game.selections).length;
    if (numberOfSelectedDefinitions == numberOfPlayers) {
      game.goToNextStep();
    }
    io.to(roomId).emit('game', game.info());
  };

  const updateScores = ({ scores }: { scores: Scores }) => {
    const roomId = getSocketRoom(socket);
    const game = GAMES.get(roomId);
    if (!game) return;
    game.scores = scores;
    io.to(roomId).emit('game', game.info());
  };

  const resetGame = () => {
    const roomId = getSocketRoom(socket);
    const game = GAMES.get(roomId);
    if (!game) return;
    game.reset();
    io.to(roomId).emit('game', game.info());
  };

  const launchNewRound = () => {
    const roomId = getSocketRoom(socket);
    const game = GAMES.get(roomId);
    if (!game) return;
    if (game.round >= game.gameSettings.roundNumber) {
      game.gameStep = GameStep.FINISHED;
      io.to(roomId).emit('game', game.info());
      return;
    }
    game.newRound();
    io.to(roomId).emit('game', game.info());
  };

  const getNewWord = () => {
    const roomId = getSocketRoom(socket);
    const game = GAMES.get(roomId);
    if (!game) return;
    game.newWord();
    io.to(roomId).emit('game', game.info());
  };

  const showResults = () => {
    const roomId = getSocketRoom(socket);
    const game = GAMES.get(roomId);
    if (!game) return;
    game.goToNextStep();
    io.to(roomId).emit('game', game.info());
  };

  const changeSettings = ({ gameSettings }: { gameSettings: GameSettings }) => {
    const roomId = getSocketRoom(socket);
    const game = GAMES.get(roomId);
    if (!game) return;
    game.gameSettings = gameSettings;
    io.to(roomId).emit('game', game.info());
  };

  socket.on('reset_game', resetGame);
  socket.on('update_scores', updateScores);
  socket.on('new_round', launchNewRound);
  socket.on('submit_definition', submitDefinition);
  socket.on('game', queryGame);
  socket.on('select_definition', selectDefinition);
  socket.on('remove_definition', removeDefinition);
  socket.on('get_new_word', getNewWord);
  socket.on('change_game_settings', changeSettings);
  socket.on('show_results', showResults);
};
