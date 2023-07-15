import { Server } from 'socket.io';
import { Room } from '.';
import dictionary from '../dictionary';
import { DictionaryLanguage } from '../dictionary/types';
import { ServerSocket, UserId } from '../socket/types';
import {
  MAX_PLAYER_IN_ROOM,
  REVEAL_CAROUSEL_TIME,
  SHOW_CAROUSEL_TIME,
} from './constants';
import { GameStep, InputDictionaryEntries, Player } from './types';
import { shuffle } from 'shuffle-seed';

export const get_random_entry = (language: DictionaryLanguage) =>
  dictionary[language][Math.floor(Math.random() * dictionary[language].length)];

export const getSocketRoom = (socket: ServerSocket) =>
  Array.from(socket.rooms.values()).filter(
    (roomId) => roomId !== socket.id
  )?.[0];

export const generateNewPlayer = (
  userId: UserId,
  playersInRoom: Player[]
): Player => {
  const playersInGame = playersInRoom.filter((player) => player.isInGame);
  const isAdmin = playersInGame.length === 0;
  const color = generateColor(playersInRoom);
  return {
    userId,
    color,
    isAdmin,
    isConnected: true,
    isInGame: true,
  };
};

const generateColor = (playersInRoom: Player[]) => {
  const alreadyGivenColors = playersInRoom.map((player) => player.color);
  const possibleHues = Array.from(Array(MAX_PLAYER_IN_ROOM).keys()).map(
    (n) => n * 137.508
  );
  const possibleColors = possibleHues.map((hue) => `hsl(${hue},100%,80%)`);
  const shuffledPossibleColors = possibleColors.sort(
    (a, b) => 0.5 - Math.random()
  );
  const newColor =
    shuffledPossibleColors.filter(
      (color) => !alreadyGivenColors.includes(color)
    )?.[0] ?? 'white';
  return newColor;
};

export const haveAllPlayerPromptDefinition = (room: Room) => {
  const game = room.game;
  const usersWhoSubmittedDefinition = Object.entries(
    room.game.inputEntries
  ).reduce((acc, [userId, entry]) => {
    if (!entry?.autosave) acc.push(userId);
    return acc;
  }, [] as string[]);
  const missingInGamePlayersDefinitions = room
    .getInGamePlayers()
    .filter((player) => !usersWhoSubmittedDefinition.includes(player.userId));
  return missingInGamePlayersDefinitions.length === 0;
};

export const haveAllPlayerGuessedDefinition = (room: Room) => {
  const usersWhoSelectedDefinition = Object.keys(room.game.selections);
  const missingInGamePlayersGuesses = room
    .getInGamePlayers()
    .filter((player) => !usersWhoSelectedDefinition.includes(player.userId));
  return missingInGamePlayersGuesses.length === 0;
};

export const goToNextGameStepIfNeededAfterPlayerLeave = (
  io: Server,
  room: Room
) => {
  const game = room.game;
  const inGamePlayers = room.getInGamePlayers();
  if (
    game.gameStep === GameStep.PROMPT &&
    haveAllPlayerPromptDefinition(room) &&
    inGamePlayers.length > 0
  ) {
    game.gameStep = GameStep.SHOW;
    if (room.timer) clearInterval(room.timer);
    runCarouselInterval(io, room, GameStep.SHOW);
  }
  if (
    game.gameStep === GameStep.GUESS &&
    haveAllPlayerGuessedDefinition(room) &&
    inGamePlayers.length > 0
  ) {
    game.gameStep = GameStep.REVEAL;
    runCarouselInterval(io, room, GameStep.REVEAL);
  }
};

const getDefinitionDisplayDelay = (definition: string) => {
  const defLength = definition.length;
  if (defLength < 50) {
    return 4000;
  } else if (defLength < 70) {
    return 5000;
  } else if (defLength < 100) {
    return 6500;
  } else if (defLength < 130) {
    return 8000;
  } else return 10000;
};

export const runCarouselInterval = (io: Server, room: Room, step: GameStep) => {
  const interval =
    step == GameStep.SHOW ? SHOW_CAROUSEL_TIME : REVEAL_CAROUSEL_TIME;
  const nextStep = step == GameStep.SHOW ? GameStep.GUESS : GameStep.RESULTS;
  var definitionIndex = 0;
  const numberOfDefinitions = Object.values(room.game.inputEntries).length + 1;
  const roomId = room.roomId;
  if (!room.game.entry) throw new Error('No word');
  const seed = `${room.game.entry.word}-${roomId}`;
  const shuffledDefinitions = shuffle(
    Object.values(room.game.inputEntries)
      .map((entry) => entry.definition)
      .concat([room.game.entry.definition]),
    seed
  );
  let defDelay = getDefinitionDisplayDelay(shuffledDefinitions[0]);
  const loop = () => {
    if (definitionIndex === numberOfDefinitions - 1 && carouselTimer) {
      io.to(roomId).emit('show_next_def');
      setTimeout(() => {
        room.game.gameStep = nextStep;
        room.updateClient(io);
      }, 3000);
      return;
    }
    io.to(roomId).emit('show_next_def');
    definitionIndex++;
    defDelay = getDefinitionDisplayDelay(shuffledDefinitions[definitionIndex]);
    setTimeout(loop, defDelay);
  };
  const carouselTimer = setTimeout(loop, defDelay);
};
