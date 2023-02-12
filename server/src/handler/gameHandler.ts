import { Server, Socket } from 'socket.io';
import mixpanel from '../mixpanel';
import Mixpanel from '../mixpanel';
import { getSocketRoom } from '../room/helpers';
import { GameStore } from '../game/gameStore';

import { GameSettings, GameStep, Scores } from '../game/types';

export const gameHandler = (
  io: Server,
  socket: Socket,
  gameStore: GameStore
) => {
  const roomId = getSocketRoom(socket);
  const game = gameStore.getGame(roomId);
  if (!game) return;

  const submitDefinition = async ({
    definition,
    example,
    autosave,
  }: {
    definition: string;
    example: string;
    autosave: boolean;
  }) => {
    game.inputEntries[socket.data.username] = { definition, example, autosave };
    const numberOfPlayers = game.players.getInGamePlayers().length;
    const numberOfDefinitions = Object.values(game.inputEntries).filter(
      (entry) => !entry?.autosave
    ).length;
    if (numberOfDefinitions == numberOfPlayers) {
      game.goToNextStep();
    }
    io.to(roomId).emit('game', game.info());
  };

  const removeDefinition = () => {
    game.removeDefinition(socket.data.username);
    io.to(roomId).emit('game', game.info());
  };

  const queryGame = () => {
    io.to(roomId).emit('game', game.info());
  };

  const selectDefinition = async ({ username }: { username: string }) => {
    game.selections[socket.data.username] = username;
    const numberOfPlayers = game.players.getInGamePlayers().length;
    const numberOfSelectedDefinitions = Object.keys(game.selections).length;
    if (numberOfSelectedDefinitions == numberOfPlayers) {
      game.goToNextStep();
    }
    io.to(roomId).emit('game', game.info());
  };

  const updateScores = ({ scores }: { scores: Scores }) => {
    game.scores = scores;
    io.to(roomId).emit('game', game.info());
  };

  const resetGame = () => {
    game.reset();
    io.to(roomId).emit('game', game.info());
  };

  const launchNewRound = () => {
    if (game.round >= game.gameSettings.roundNumber) {
      game.gameStep = GameStep.FINISHED;
      io.to(roomId).emit('game', game.info());
      return;
    }
    game.newRound(io);
    io.to(roomId).emit('game', game.info());
  };

  const getNewWord = () => {
    mixpanel.changeWord(socket.data?.userId, socket.data?.ip, game.entry?.word);
    game.newWord(io);
    io.to(roomId).emit('game', game.info());
  };

  const showResults = () => {
    game.goToNextStep();
    io.to(roomId).emit('game', game.info());
  };

  const changeSettings = ({ gameSettings }: { gameSettings: GameSettings }) => {
    game.gameSettings = gameSettings;
    io.to(roomId).emit('game', game.info());
  };

  const launchGame = async () => {
    const players = game.players.getInGamePlayers();
    Mixpanel.launchGame(
      socket.data?.userId,
      socket.data?.ip,
      players,
      game?.gameSettings,
      roomId
    );
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
