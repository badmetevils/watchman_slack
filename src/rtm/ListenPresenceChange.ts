import { watchmanRTM } from '@osl-slack-rtm-app';
import { IPresenceData } from '@typing/presence';

export default class ListenPresenceChange {
  public listen() {
    watchmanRTM.on('presence_change', async ({ user, presence }) => {
      let data: IPresenceData = {
        slackID: user,
        status: presence.toUpperCase()
      };
      if (presence === 'active') {
      }
      if (presence === 'away') {
      }
    });
  }
}
