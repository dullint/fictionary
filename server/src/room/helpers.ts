import { Room } from '.';
import dictionary from '../dictionary';
import logger from '../logging';
import { Socket, UserId } from '../socket/types';
import { MAX_PLAYER_IN_ROOM } from './constants';
import { GameStep, Player } from './types';

export const get_random_entry = () =>
  dictionary.entries[Math.floor(Math.random() * dictionary.entries.length)];

export const getSocketRoom = (socket: Socket) =>
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
  console.log({ room });
  const game = room.game;
  const numberOfDefinitions = Object.values(game.inputEntries).filter(
    (entry) => !entry?.autosave
  ).length;
  const numberOfPlayers = room.getInGamePlayers().length;
  console.log({
    inGamePlayers: room.getInGamePlayers(),
    definitions: Object.values(game.inputEntries).filter(
      (entry) => !entry?.autosave
    ),
    equality: numberOfDefinitions === numberOfPlayers,
  });
  return numberOfDefinitions === numberOfPlayers;
};

export const haveAllPlayerGuessedDefinition = (room: Room) => {
  const numberOfPlayers = room.getInGamePlayers().length;
  const numberOfSelectedDefinitions = Object.keys(room.game.selections).length;
  return numberOfSelectedDefinitions == numberOfPlayers;
};

export const goToNextGameStepIfNeededAfterPlayerLeave = (room: Room) => {
  const game = room.game;
  if (
    game.gameStep === GameStep.PROMPT &&
    haveAllPlayerPromptDefinition(room)
  ) {
    game.gameStep = GameStep.GUESS;
  }
  if (
    game.gameStep === GameStep.GUESS &&
    haveAllPlayerGuessedDefinition(room)
  ) {
    game.gameStep = GameStep.REVEAL;
  }
};
