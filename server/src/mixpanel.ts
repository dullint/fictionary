import MixpanelClient from 'mixpanel';
import { GameSettings } from './game/types';
import { UserId } from './socket/sessionStore';
const MIXPANEL_TOKEN = 'f1f650cd2f800c43fc7b520990c1b226';

class Mixpanel {
  mixpanel: MixpanelClient.Mixpanel;

  constructor() {
    this.mixpanel = MixpanelClient.init(MIXPANEL_TOKEN, {
      host: 'api-eu.mixpanel.com',
    });
  }

  gameLaunched(
    adminUserId: UserId,
    gameSettings: GameSettings,
    numberOfPlayer: number
  ) {
    this.mixpanel.track('Game Launched', {
      distinct_id: adminUserId,
      gameSettings,
      numberOfPlayer,
    });
  }

  playerConnected(userId: UserId) {
    this.mixpanel.track('Connection', {
      distinct_id: userId,
    });
  }
}

export default new Mixpanel();
