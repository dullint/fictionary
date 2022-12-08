import MixpanelClient from 'mixpanel';
import { RemoteSocket } from 'socket.io';
import { GameSettings } from './game/types';
import { Player, RoomId } from './room/types';
import { UserId } from './socket/sessionStore';
const MIXPANEL_TOKEN = 'f1f650cd2f800c43fc7b520990c1b226';

class Mixpanel {
  mixpanel: MixpanelClient.Mixpanel;

  constructor() {
    this.mixpanel = MixpanelClient.init(MIXPANEL_TOKEN, {
      host: 'api-eu.mixpanel.com',
    });
  }

  launchGame(
    userId: UserId,
    ip: string,
    players: Player[],
    gameSettings: GameSettings,
    roomId: RoomId
  ) {
    this.mixpanel.track('launch_game', {
      distinct_id: userId,
      ip,
      gameSettings,
      roomId,
      numberOfPlayer: players.length,
      userIds: players.map((player) => player.userId),
    });
    players.forEach((player) => {
      this.mixpanel.people.increment(player.userId, 'games_played');
    });
  }

  userConnect(userId: UserId, ip: string) {
    this.mixpanel.track('user_connect', {
      distinct_id: userId,
      ip,
    });
  }

  changeWord(userId: UserId, ip: string, word?: string) {
    this.mixpanel.track('change_definition', {
      distinct_id: userId,
      ip,
      word,
    });
  }
}

export default new Mixpanel();
