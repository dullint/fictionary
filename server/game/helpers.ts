import { Server, Socket } from 'socket.io';
import { getSocketRoom } from '../room/helpers';
import { dictionnary } from './dictionnary';
import GAMES, { Game } from './games';
import { GameStep } from './types';

export const get_random_entry = () =>
  dictionnary[Math.floor(Math.random() * dictionnary.length)];
