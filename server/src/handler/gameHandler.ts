import { Server } from 'socket.io';
import mixpanel from '../mixpanel';
import Mixpanel from '../mixpanel';
import {
  getSocketRoom,
  haveAllPlayerGuessedDefinition,
  haveAllPlayerPromptDefinition,
  runShowInterval,
} from '../room/helpers';
import roomStore from '../room/roomStore';

import {
  EventCallback,
  ServerSocket,
  SubmitDefinitionPayload,
  UserId,
} from '../socket/types';
import logger from '../logging';
import { DEFAULT_GAME_STATE } from '../room/constants';
import { get_random_entry } from '../room/helpers';
import { Room } from '../room';
import { GameSettings, GameStep, Scores, Username } from '../room/types';
import { UpdateUsernameError } from './errors';

export const gameHandler = (io: Server, socket: ServerSocket) => {
  const changeGameSettings = (gameSettings: GameSettings) => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    room.gameSettings = gameSettings;
    logger.info(`[ROOM ${roomId}] Game settings changed`);
    room.updateClient(io);
  };

  const submitDefinition = async (payload: SubmitDefinitionPayload) => {
    const { definition, example, autosave } = payload;
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    const userId = socket.data.userId;
    if (!room) return;
    const game = room.game;
    game.inputEntries[userId] = {
      definition,
      example,
      autosave,
    };
    logger.info(`[ROOM ${roomId}] Player submited a new definition`);
    if (haveAllPlayerPromptDefinition(room)) {
      game.gameStep = GameStep.SHOW;
      runShowInterval(io, room);
      logger.info(
        `[ROOM ${roomId}] All definitions submitted, moving forward to the SHOW step`
      );
    }
    room.updateClient(io);
  };

  const removeDefinition = () => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    const game = room.game;
    const userId = socket.data.userId;
    delete game.inputEntries?.[userId];
    logger.info(`[ROOM ${roomId}] User removed his definition`);
    room.updateClient(io);
  };

  const selectDefinition = async (selectedUserId: UserId) => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    room.game.selections[socket.data.userId] = selectedUserId;
    if (haveAllPlayerGuessedDefinition(room)) {
      room.game.gameStep = GameStep.REVEAL;
      logger.info(
        `[ROOM ${roomId}] All definitions guessed, moving forward to the REVEAL step`
      );
    }
    room.updateClient(io);
  };

  const updateScores = (scores: Scores) => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    const game = room.game;
    game.scores = scores;
    logger.info(`[ROOM ${roomId}] Scores updated`);
    room.updateClient(io);
  };

  const resetGame = () => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    room.game = Object.assign({}, DEFAULT_GAME_STATE);
    logger.info(`[ROOM ${roomId}] Game reseted`);
    room.updateClient(io);
  };

  const launchNewRound = () => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    const game = room.game;
    if (game.round >= room.gameSettings.roundNumber) {
      game.gameStep = GameStep.FINISHED;
      logger.info(`[ROOM ${roomId}] Game finished`);
      room.updateClient(io);
      return;
    }
    game.round++;
    game.gameStep = GameStep.PROMPT;
    game.selections = {};
    game.inputEntries = {};
    logger.info(`[ROOM ${roomId}] Round ${game.round} launched`);
    getNewWord();
    room.updateClient(io);
  };

  const getNewWord = () => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    const game = room.game;
    mixpanel.changeWord(socket.data?.userId, socket.data?.ip, game.entry?.word);
    if (room.timer) clearInterval(room.timer);
    room.game.inputEntries = {};
    const language = room.gameSettings.language;
    var entry = get_random_entry(language);
    while (room.wordSeen.includes(entry.word)) {
      entry = get_random_entry(language);
    }
    room.game.entry = entry;
    logger.info(`[ROOM ${roomId}] New word`);
    runTimer(room, room.gameSettings.maxPromptTime);
    room.updateClient(io);
  };

  const runTimer = (room: Room, time: number) => {
    var counter = time * 60;
    const roomId = room.roomId;
    room.timer = setInterval(() => {
      io.to(roomId).emit('timer', counter);
      if (counter === 0 && room.timer) {
        clearInterval(room.timer);
        room.game.gameStep = GameStep.SHOW;
        runShowInterval(io, room);
        logger.info(
          `[ROOM ${roomId}] Timer ran out of time, moving forward to the SHOW step`
        );
        room.updateClient(io);
      }
      counter--;
    }, 1000);
  };

  const showResults = () => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    const game = room.game;
    const gameSettings = room.gameSettings;
    const isInLastRound = game.round >= gameSettings.roundNumber;
    game.gameStep = isInLastRound ? GameStep.FINISHED : GameStep.RESULTS;
    if (game.gameStep === GameStep.FINISHED) {
      logger.info(`[ROOM ${roomId}] Game finished`);
    } else {
      logger.info(`[ROOM ${roomId}] Results showed`);
    }

    room.updateClient(io);
  };

  const launchGame = async () => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    const gamePlayers = room.getInGamePlayers();
    const userId = socket.data?.userId;
    Mixpanel.launchGame(
      userId,
      socket.data?.ip,
      gamePlayers,
      room.gameSettings,
      roomId
    );
    logger.info(`[ROOM ${roomId}] User launched game`);
    launchNewRound();
  };

  const updateUsername = async (
    username: Username,
    callback: EventCallback
  ) => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    const usernamesInGame = room.players.map((player) => player.username);
    if (usernamesInGame.includes(username)) {
      callback({
        success: false,
        error: UpdateUsernameError.alreadyTaken,
      });
      return;
    }
    const player = room.getOnePlayer(socket.data.userId);
    if (!player) return;
    player.username = username;
    callback({
      success: true,
    });
    room.updateClient(io);
    logger.info(`[ROOM ${roomId}] User updated his username to ${username}`);
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
  socket.on('change_game_settings', changeGameSettings);
};
