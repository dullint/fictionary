import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/croodles';
import { Player } from '../../../../server/src/room/types';
import dictionaryImage from '../../img/dictionary.jpg';

export const getAvatarString = (player: Player) => {
  const isDictionary = player?.userId === 'DICTIONARY_PLAYER';
  const stringSVG = createAvatar(style, {
    seed: `${player?.username}7`,
    backgroundColor: player?.color,
    size: 120,
    topColor: ['black'],
  });

  return isDictionary
    ? dictionaryImage
    : `data:image/svg+xml;utf8,${encodeURIComponent(stringSVG)}`;
};
