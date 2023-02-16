import { Server } from 'socket.io';
import mixpanel from '../mixpanel';
import Mixpanel from '../mixpanel';
import { getSocketRoom } from '../room/helpers';
import roomStore from '../room/roomStore';

import { GameStep, Scores } from '../game/types';
import {
  SelectDefinitionPayload,
  Socket,
  SubmitDefinitionPayload,
} from '../socket/types';
import { Username } from '../player/type';
import { UpdateUsernameError } from '../player/errors';
import logger from '../logging';

export const gameHandler = (io: Server, socket: Socket) => {
  const submitDefinition = async (payload: SubmitDefinitionPayload) => {
    const { definition, example, autosave } = payload;
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    const game = room.game;
    game.submitDefinition(socket.data.userId, definition, example, autosave);
    const numberOfPlayers = room.players.getInGamePlayers().length;
    const numberOfDefinitions = Object.values(game.inputEntries).filter(
      (entry) => !entry?.autosave
    ).length;
    if (numberOfDefinitions == numberOfPlayers) {
      game.goToNextStep(room.gameSettings);
    }
    room.updateClient(io);
  };

  const removeDefinition = () => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    const game = room.game;
    game.removeDefinition(socket.data.userId);
    room.updateClient(io);
  };

  const selectDefinition = async ({ userId }: SelectDefinitionPayload) => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    const game = room.game;
    const roomPlayers = room.players;
    game.selectDefinition(socket.data.userId, userId);
    const numberOfPlayers = roomPlayers.getInGamePlayers().length;
    const numberOfSelectedDefinitions = Object.keys(game.selections).length;
    if (numberOfSelectedDefinitions == numberOfPlayers) {
      game.goToNextStep(room.gameSettings);
    }
    room.updateClient(io);
  };

  const updateScores = ({ scores }: { scores: Scores }) => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    const game = room.game;
    game.scores = scores;
    room.updateClient(io);
  };

  const resetGame = () => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    const game = room.game;
    game.reset();
    room.updateClient(io);
  };

  const launchNewRound = () => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    const game = room.game;
    if (game.round >= room.gameSettings.roundNumber) {
      game.gameStep = GameStep.FINISHED;
      room.updateClient(io);
      return;
    }
    game.newRound(io, room.gameSettings);
    room.updateClient(io);
  };

  const getNewWord = () => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    const game = room.game;
    mixpanel.changeWord(socket.data?.userId, socket.data?.ip, game.entry?.word);
    game.newWord(io, room.gameSettings);
    room.updateClient(io);
  };

  const showResults = () => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    const game = room.game;
    game.goToNextStep(room.gameSettings);
    room.updateClient(io);
  };

  const launchGame = async () => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
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

  const updateUsername = async ({ username }: { username: Username }) => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    const usernamesInGame = room.players
      .getAllPlayers()
      .map((player) => player.username);
    if (usernamesInGame.includes(username)) {
      socket.emit('update_username_error', UpdateUsernameError.alreadyTaken);
      return;
    }
    room.players.updateUsername(socket.data.userId, username);
    room.updateClient(io);
    logger.info(`User updated his username to ${username}`, {
      userId: socket.data.userId,
    });
    socket.emit('username_updated');
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
  socket.on('update_username', updateUsername);
};
