import { Server, Socket } from 'socket.io';
import mixpanel from '../mixpanel';
import Mixpanel from '../mixpanel';
import { getConnectedPlayers, getSocketRoom } from '../room/helpers';
import { InMemoryGameStore } from '../socket/gameStore';

import { GameSettings, GameStep, Scores } from './types';

export const gameHandler = (
  io: Server,
  socket: Socket,
  gameStore: InMemoryGameStore
) => {
  const submitDefinition = ({
    definition,
    example,
    autosave,
  }: {
    definition: string;
    example: string;
    autosave: boolean;
  }) => {
    const roomId = getSocketRoom(socket);
    const game = gameStore.getGame(roomId);
    if (!game) return;
    game.inputEntries[socket.data.username] = { definition, example, autosave };
    const numberOfGamePlayers = game.gamePlayers.length;
    const numberOfDefinitions = Object.values(game.inputEntries).filter(
      (entry) => !entry?.autosave
    ).length;
    if (numberOfDefinitions === numberOfGamePlayers) {
      game.goToNextStep();
    }
    io.to(roomId).emit('game', game.info());
  };

  const removeDefinition = () => {
    const roomId = getSocketRoom(socket);
    const game = gameStore.getGame(roomId);
    if (!game) return;
    game.removeDefinition(socket.data.username);
    io.to(roomId).emit('game', game.info());
  };

  const queryGame = () => {
    const roomId = getSocketRoom(socket);
    const game = gameStore.getGame(roomId);
    if (!game) return;
    io.to(roomId).emit('game', game.info());
  };

  const selectDefinition = ({ username }: { username: string }) => {
    const roomId = getSocketRoom(socket);
    const game = gameStore.getGame(roomId);
    if (!game) return;
    game.selections[socket.data.username] = username;
    const numberOfPlayers = game.gamePlayers.length;
    const numberOfSelectedDefinitions = Object.keys(game.selections).length;
    if (numberOfSelectedDefinitions === numberOfPlayers) {
      game.goToNextStep();
    }
    io.to(roomId).emit('game', game.info());
  };

  const updateScores = ({ scores }: { scores: Scores }) => {
    const roomId = getSocketRoom(socket);
    const game = gameStore.getGame(roomId);
    if (!game) return;
    game.scores = scores;
    io.to(roomId).emit('game', game.info());
  };

  const resetGame = () => {
    const roomId = getSocketRoom(socket);
    const game = gameStore.getGame(roomId);
    if (!game) return;
    game.reset();
    io.to(roomId).emit('game', game.info());
  };

  const launchNewRound = () => {
    const roomId = getSocketRoom(socket);
    const game = gameStore.getGame(roomId);
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
    const game = gameStore.getGame(roomId);
    if (!game) return;
    mixpanel.changeWord(socket.data?.userId, socket.data?.ip, game.entry?.word);
    game.newWord();
    io.to(roomId).emit('game', game.info());
  };

  const showResults = () => {
    const roomId = getSocketRoom(socket);
    const game = gameStore.getGame(roomId);
    if (!game) return;
    game.goToNextStep();
    io.to(roomId).emit('game', game.info());
  };

  const changeSettings = ({ gameSettings }: { gameSettings: GameSettings }) => {
    const roomId = getSocketRoom(socket);
    const game = gameStore.getGame(roomId);
    if (!game) return;
    game.gameSettings = gameSettings;
    io.to(roomId).emit('game', game.info());
  };

  const launchGame = async () => {
    const roomId = getSocketRoom(socket);
    const players = await getConnectedPlayers(io, roomId);
    const game = gameStore.getGame(roomId);
    if (!game) return;
    Mixpanel.launchGame(
      socket.data?.userId,
      socket.data?.ip,
      players,
      game?.gameSettings,
      roomId
    );
    game.addPlayers(players);
    launchNewRound();
  };

  socket.on('reset_game', resetGame);
  socket.on('launch_game', launchGame);
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
