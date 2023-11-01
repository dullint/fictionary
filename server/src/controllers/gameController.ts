import dictionary from '../dictionary';
import logger from '../logging';
import { Game, GameSettings } from '../models/Game';
import { RoomId } from '../room/types';
import { SubmitDefinitionPayload, UserId } from '../socket/types';

export class GameController {
  private games: Map<string, Game>;

  constructor() {
    this.games = new Map<string, Game>();
  }

  // createGame(gameId: string) {}

  getGame(roomId: RoomId): Game | undefined {
    const game = this.games.get(roomId);
    if (!game) {
      logger.debug(`[GAME ${roomId}] Game not found`);
      return;
    }
    return game;
  }

  changeSettings = (roomId: RoomId, gameSettings: GameSettings) => {
    const game = this.getGame(roomId);
    if (!game) return;
    game.settings = gameSettings;
    logger.info(`[GAME ${roomId}] Game settings changed`);
  };

  submitDefinition = async (
    roomId: RoomId,
    userId: UserId,
    payload: SubmitDefinitionPayload
  ) => {
    const game = this.getGame(roomId);
    if (!game) return;
    const { definition, example, autosave } = payload;
    game.inputEntries[userId] = {
      definition,
      example,
      autosave,
    };
    logger.info(`[ROOM ${roomId}] Player submited a new definition`);
    if (haveAllPlayerPromptDefinition(room)) {
      if (room.timer) clearInterval(room.timer);
      game.gameStep = GameStep.SHOW;
      runCarouselInterval(io, room, GameStep.SHOW);
      logger.info(
        `[ROOM ${roomId}] All definitions submitted, moving forward to the SHOW step`
      );
    }
    room.updateClient(io);
  };

  removeDefinition = () => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    const game = room.game;
    const userId = socket.data.userId;
    delete game.inputEntries?.[userId];
    logger.info(`[ROOM ${roomId}] User removed his definition`);
    room.updateClient(io);
  };

  selectDefinition = async (selectedUserId: UserId) => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    room.game.selections[socket.data.userId] = selectedUserId;
    if (haveAllPlayerGuessedDefinition(room)) {
      if (room.timer) clearInterval(room.timer);
      room.game.gameStep = GameStep.REVEAL;
      logger.info(
        `[ROOM ${roomId}] All definitions guessed, moving forward to the REVEAL step`
      );
    }
    room.updateClient(io);
  };

  updateScores = (scores: Scores) => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    const game = room.game;
    game.scores = scores;
    logger.info(`[ROOM ${roomId}] Scores updated`);
    room.updateClient(io);
  };

  resetGame = () => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    room.game = Object.assign({}, DEFAULT_GAME_STATE);
    console.log('resetGame', { inputEntries: room.game.inputEntries });
    logger.info(`[ROOM ${roomId}] Game reseted`);
    room.updateClient(io);
  };

  launchNewRound = () => {
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
    console.log('launchNewRound', { inputEntries: room.game.inputEntries });
    logger.info(`[ROOM ${roomId}] Round ${game.round} launched`);
    getNewWord(room);
    room.updateClient(io);
  };

  changeWord = () => {
    const roomId = getSocketRoom(socket);
    const room = roomStore.getRoom(roomId, io);
    if (!room) return;
    const game = room.game;
    if (game.entry?.word) {
      mixpanel.changeWord(
        socket.data?.userId,
        socket.data?.ip,
        game.entry.word
      );
    }
    getNewWord(room);
  };

  getNewWord = (room: Room) => {
    if (room.timer) clearInterval(room.timer);
    room.game.inputEntries = {};
    const language = room.gameSettings.language;
    var dictEntry = dictionary.getRandomWord(language);
    while (room.wordSeen.includes(entry.word)) {
      entry = get_random_entry(language);
    }
    room.wordSeen.push(entry.word);
    room.game.entry = entry;
    logger.info(`[ROOM ${room.roomId}] New word`);
    runWritingTimer(room, room.gameSettings.maxPromptTime);
    room.updateClient(io);
  };

  runWritingTimer = (room: Room, time: number) => {
    var counter = time * 60;
    const roomId = room.roomId;
    room.timer = setInterval(() => {
      io.to(roomId).emit('timer', counter);
      if (counter === 0 && room.timer) {
        clearInterval(room.timer);
        room.game.gameStep = GameStep.SHOW;
        runCarouselInterval(io, room, GameStep.SHOW);
        logger.info(
          `[ROOM ${roomId}] Timer ran out of time, moving forward to the SHOW step`
        );
        room.updateClient(io);
      }
      counter--;
    }, 1000);
  };

  showResults = () => {
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

  launchGame = async () => {
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

  updateUsername = async (username: Username, callback: EventCallback) => {
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
}

export const gameController = new GameController();
