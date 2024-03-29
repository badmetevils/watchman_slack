import { watchmanRTM } from '@osl-slack-rtm-app';
import { IPresenceData } from '@typing/presence';
import AwayStatus from '@bin/AwayStatus';
import ActiveStatus from '@bin/ActiveStatus';

export default class ListenPresenceChange {
  public async listen() {
    watchmanRTM.on('presence_change', async ({ user, presence }) => {
      const data: IPresenceData = {
        slackID: user,
        status: presence.toUpperCase()
      };
      if (presence === 'active') {
        const status = new ActiveStatus(data);
        await status.log();
      }
      if (presence === 'away') {
        const status = new AwayStatus(data);
        await status.log();
      }
    });
  }
}
