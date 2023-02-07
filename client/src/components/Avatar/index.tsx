import { CircularProgress, Avatar as MUIAvatar, Badge } from '@mui/material';
import React from 'react';
import { GamePlayer } from '../../../../server/src/room/types';
import { theme } from '../../theme';
import { getAvatarString } from './helpers';
import crownImage from '../../img/coloredCrown.png';

interface PropsType {
  player: GamePlayer;
  showCrown?: boolean;
  size?: 'big' | 'small' | 'medium';
  badgeContent?: string | number;
  displayBadge: boolean;
}
const Avatar = (props: PropsType) => {
  const {
    player,
    size = 'big',
    badgeContent,
    displayBadge,
    showCrown = false,
  } = props;
  const avatarSize = size === 'small' ? 35 : size === 'medium' ? 60 : 80;
  const badgeSize = size === 'small' ? 18 : size === 'medium' ? 30 : 40;
  const borderSize = size === 'small' ? 1 : size === 'medium' ? 2 : 2;
  const fontSize = size === 'small' ? 12 : size === 'medium' ? 20 : 25;
  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      badgeContent={
        player?.isAdmin && showCrown ? (
          <img
            src={crownImage}
            alt={'test'}
            style={{
              transform: 'rotate(26deg)',
              translate: '0 -42%',
              height: 1.5 * badgeSize,
              width: 1.5 * badgeSize,
            }}
          />
        ) : null
      }
    >
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          displayBadge ? (
            <MUIAvatar
              alt="points"
              sx={{
                translate: '0 -25%',
                transition: 'transform 400ms',
                transform: displayBadge ? null : 'scale(30%)',
                backgroundColor: theme.palette.secondary.main,
                height: badgeSize,
                width: badgeSize,
                fontSize: fontSize,
                border: `1px solid black`,
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
            bgcolor: player?.color,
            border: `${borderSize}px solid black`,
          }}
        >
          {player?.username ? (
            <img
              src={getAvatarString(player)}
              style={{ width: '140%', height: '140%' }}
              alt={player?.username}
            />
          ) : (
            <CircularProgress />
          )}
        </MUIAvatar>
      </Badge>
    </Badge>
  );
};

export default Avatar;
