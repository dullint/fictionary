export enum UpdateUsernameError {
  alreadyTaken = 'Username already taken',
}

export enum JoinRoomError {
  roomNotFound = 'The room does not exist',
  roomFull = `The room is full`,
  inAnotherRoom = 'Already in annother room, hard refresh your browser window',
  gameAlreadyLaunched = 'Game already launched',
  timeoutError = 'Timout error when joining the room',
}

export enum RoomError {
  roomNotFound = 'Your room does not exist anymore',
}

export enum CreateRoomError {}
