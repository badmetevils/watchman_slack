import ActiveStatus from '@bin/ActiveStatus';
import { watchmanRTM } from '@osl-slack-rtm-app';
import { IPresenceData } from '@typing/presence';
import AwayStatus from '@bin/AwayStatus';

export default class ListenPresenceChange {
  public listen() {
    watchmanRTM.on('presence_change', async ({ user, presence }) => {
      let data: IPresenceData = {
        slackID: user,
        status: presence.toUpperCase()
      };
      if (presence === 'active') {
        let status = new ActiveStatus(data);
        await status.findAndUpdate();
      }
      if (presence === 'away') {
        let status = new AwayStatus(data);
        await status.set();
      }
    });
  }
}
