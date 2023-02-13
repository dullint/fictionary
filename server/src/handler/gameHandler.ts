import { Server, Socket } from 'socket.io';
import mixpanel from '../mixpanel';
import Mixpanel from '../mixpanel';
import { getSocketRoom } from '../room/helpers';
import roomStore from '../room/roomStore';

import { GameStep, Scores } from '../game/types';
import { SubmitDefinitionPayload } from '../socket/types';

export const gameHandler = (io: Server, socket: Socket) => {
  const submitDefinition = async ({
    definition,
    example,
    autosave,
  }: SubmitDefinitionPayload) => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(io, roomId);
    if (!room) return;
    const game = room.game;
    game.inputEntries[socket.data.username] = {
      definition,
      example,
      autosave,
    };
    const numberOfPlayers = room.players.getInGamePlayers().length;
    const numberOfDefinitions = Object.values(game.inputEntries).filter(
      (entry) => !entry?.autosave
    ).length;
    if (numberOfDefinitions == numberOfPlayers) {
      game.goToNextStep(room.gameSettings);
    }
    game.updateClient(io);
  };

  const removeDefinition = () => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(io, roomId);
    if (!room) return;
    const game = room.game;
    if (!game) return;
    game.removeDefinition(socket.data.username);
    game.updateClient(io);
  };

  const selectDefinition = async ({ username }: { username: string }) => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(io, roomId);
    if (!room) return;
    const game = room.game;
    const roomPlayers = room.players;
    if (!game) return;
    game.selections[socket.data.username] = username;
    const numberOfPlayers = roomPlayers.getInGamePlayers().length;
    const numberOfSelectedDefinitions = Object.keys(game.selections).length;
    if (numberOfSelectedDefinitions == numberOfPlayers) {
      game.goToNextStep(room.gameSettings);
    }
    game.updateClient(io);
  };

  const updateScores = ({ scores }: { scores: Scores }) => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(io, roomId);
    if (!room) return;
    const game = room.game;
    game.scores = scores;
    game.updateClient(io);
  };

  const resetGame = () => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(io, roomId);
    if (!room) return;
    const game = room.game;
    game.reset();
    game.updateClient(io);
  };

  const launchNewRound = () => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(io, roomId);
    if (!room) return;
    const game = room.game;
    if (game.round >= room.gameSettings.roundNumber) {
      game.gameStep = GameStep.FINISHED;
      game.updateClient(io);
      return;
    }
    game.newRound(io, room.gameSettings);
    game.updateClient(io);
  };

  const getNewWord = () => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(io, roomId);
    if (!room) return;
    const game = room.game;
    mixpanel.changeWord(socket.data?.userId, socket.data?.ip, game.entry?.word);
    game.newWord(io, room.gameSettings);
    game.updateClient(io);
  };

  const showResults = () => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(io, roomId);
    if (!room) return;
    const game = room.game;
    game.goToNextStep(room.gameSettings);
    game.updateClient(io);
  };

  const launchGame = async () => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(io, roomId);
    if (!room) return;
    const game = room.game;
    const gamePlayers = room.players.getInGamePlayers();
    Mixpanel.launchGame(
      socket.data?.userId,
      socket.data?.ip,
      gamePlayers,
      room.gameSettings,
      roomId
    );
    launchNewRound();
  };

  socket.on('reset_game', resetGame);
  socket.on('launch_game', launchGame);
  socket.on('update_scores', updateScores);
  socket.on('new_round', launchNewRound);
  socket.on('submit_definition', submitDefinition);
  socket.on('select_definition', selectDefinition);
  socket.on('remove_definition', removeDefinition);
  socket.on('get_new_word', getNewWord);
  socket.on('show_results', showResults);
};
