import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/croodles';
import { GamePlayer } from '../../../../server/src/room/types';
import dictionaryImage from '../../img/dictionary.jpg';

export const getAvatarString = (gamePlayer: GamePlayer) => {
  const isDictionary = gamePlayer?.socketId === 'dictionary';
  const stringSVG = createAvatar(style, {
    seed: gamePlayer?.username,
    backgroundColor: gamePlayer?.color,
    size: 120,
    topColor: ['black'],
  });

  return isDictionary
    ? dictionaryImage
    : `data:image/svg+xml;utf8,${encodeURIComponent(stringSVG)}`;
};
