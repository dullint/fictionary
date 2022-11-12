import { CircularProgress, Avatar as MUIAvatar, Badge } from '@mui/material';
import React from 'react';
import { Player } from '../../../../server/room/types';
import { getAvatarString } from './helpers';

interface PropsType {
  player: Player;
  size?: 'big' | 'small' | 'medium';
  badgeContent?: string | number;
  displayBadge: boolean;
}
const Avatar = (props: PropsType) => {
  const { player, size = 'big', badgeContent, displayBadge } = props;
  const avatarSize = size === 'small' ? 40 : size === 'medium' ? 60 : 80;
  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        displayBadge ? (
          <MUIAvatar
            alt="points"
            sx={{
              translate: '-10% -25%',
              transition: 'transform 400ms',
              transform: displayBadge ? null : 'scale(30%)',
              backgroundColor: 'orange',
            }}
          >
            {badgeContent}
          </MUIAvatar>
        ) : null
      }
    >
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
            alt={player.username}
          />
        ) : (
          <CircularProgress />
        )}
      </MUIAvatar>
    </Badge>
  );
};

export default Avatar;
