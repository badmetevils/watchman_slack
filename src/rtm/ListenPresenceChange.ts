import db from '@models/index';
import { watchmanRTM } from '@osl-slack-rtm-app';
import time from '@lib/time';

interface IPresenceData {
  slackID: string;
  status: 'ACTIVE' | 'AWAY';
}

export default class ListenPresenceChange {
  public listen() {
    watchmanRTM.on('presence_change', async ({ user, presence }) => {
      let data: IPresenceData = {
        slackID: user,
        status: presence.toUpperCase()
      };
      if (presence === 'active') {
        await this.handleActive(data);
      }
      if (presence === 'away') {
        await this.handleAway(data);
      }
      // console.log(`User: ${event.user} Presence: ${event.presence}`);
      console.log({ user, presence });
    });
  }

  private async handleAway(user: IPresenceData) {
    let PENALTY_IN_SECONDS = parseInt(process.env.PENALTY_IN_SECONDS || '1800');
    let penalty = time().subtract(PENALTY_IN_SECONDS, 'seconds').toMySqlDateTime().toString();
    let list = await db.table.userStatusLogs.create({
      ...user,
      timestamp: penalty
    });
    console.log({ list });
  }

  private async handleActive(user: IPresenceData) {}
}
