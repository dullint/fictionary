import { Server } from 'socket.io';
import mixpanel from '../mixpanel';
import Mixpanel from '../mixpanel';
import {
  getSocketRoom,
  haveAllPlayerGuessedDefinition,
  haveAllPlayerPromptDefinition,
} from '../room/helpers';
import roomStore from '../room/roomStore';

import {
  SelectDefinitionPayload,
  Socket,
  SubmitDefinitionPayload,
  UpdateUsernamePayload,
} from '../socket/types';
import logger from '../logging';
import { DEFAULT_GAME_STATE } from '../room/constants';
import { get_random_entry } from '../room/helpers';
import { Room } from '../room';
import { GameStep, Scores } from '../room/types';
import { UpdateUsernameError } from './errors';

export const gameHandler = (io: Server, socket: Socket) => {
  const submitDefinition = async (payload: SubmitDefinitionPayload) => {
    const { definition, example, autosave } = payload;
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    const game = room.game;
    game.inputEntries[socket.data.userId] = {
      definition,
      example,
      autosave,
    };
    if (haveAllPlayerPromptDefinition(room)) {
      console.log('guess in submit def');
      game.gameStep = GameStep.GUESS;
    }
    room.updateClient(io);
  };

  const removeDefinition = () => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    const game = room.game;
    delete game.inputEntries?.[socket.data.userId];
    room.updateClient(io);
  };

  const selectDefinition = async ({ userId }: SelectDefinitionPayload) => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    room.game.selections[socket.data.userId] = userId;
    if (haveAllPlayerGuessedDefinition(room)) {
      room.game.gameStep = GameStep.REVEAL;
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
    room.game = DEFAULT_GAME_STATE;
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
    game.round++;
    game.gameStep = GameStep.PROMPT;
    game.selections = {};
    game.inputEntries = {};
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
    var entry = get_random_entry();
    while (room.wordSeen.includes(entry.word)) {
      entry = get_random_entry();
    }
    room.game.entry = entry;
    runTimer(room, room.gameSettings.maxPromptTime);
    room.updateClient(io);
  };

  const runTimer = (room: Room, time: number) => {
    var counter = time * 60;
    room.timer = setInterval(() => {
      io.to(room.roomId).emit('timer', counter);
      if (counter === 0 && room.timer) {
        clearInterval(room.timer);
        console.log('guess in run timer');
        room.game.gameStep = GameStep.GUESS;
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

    room.updateClient(io);
  };

  const launchGame = async () => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    const gamePlayers = room.getInGamePlayers();
    Mixpanel.launchGame(
      socket.data?.userId,
      socket.data?.ip,
      gamePlayers,
      room.gameSettings,
      roomId
    );
    launchNewRound();
  };

  const updateUsername = async ({ username }: UpdateUsernamePayload) => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    const usernamesInGame = room.players.map((player) => player.username);
    if (usernamesInGame.includes(username)) {
      socket.emit('update_username_error', UpdateUsernameError.alreadyTaken);
      return;
    }
    const player = room.getOnePlayer(socket.data.userId);
    if (!player) return;
    player.username = username;
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
