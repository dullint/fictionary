import { CircularProgress, Avatar as MUIAvatar } from '@mui/material';
import React from 'react';
import { Player } from '../../../../server/room/types';
import { getAvatarString } from './helpers';

interface PropsType {
  player: Player;
  size?: 'big' | 'small';
}
const Avatar = (props: PropsType) => {
  const { player, size = 'big' } = props;
  const avatarSize = size === 'small' ? 40 : 80;
  return (
    <MUIAvatar
      sx={{
        width: avatarSize,
        height: avatarSize,
        m: 1,
        bgcolor: player.color,
      }}
    >
      {player.username ? (
        <img
          src={getAvatarString(player)}
          style={{ width: '140%', height: '140%' }}
        />
      ) : (
        <CircularProgress />
      )}
    </MUIAvatar>
  );
};

export default Avatar;
