import { IUser, IUserStatusLogModel } from './../models/interface/model.d';
import db from '@models/index';
import { watchmanRTM } from '@osl-slack-rtm-app';
import time from '@lib/time';
import { isWorkingHours } from '@shared/utils';
import TimeSheet from '@bin/TimeSheet';

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
      // console.log({ user, presence });
    });
  }

  private async handleAway(user: IPresenceData) {
    let PENALTY_IN_SECONDS = parseInt(process.env.PENALTY_IN_SECONDS || '1800');
    let penalty = time().subtract(PENALTY_IN_SECONDS, 'seconds').toMySqlDateTime().toString();
    let list = await db.table.userStatusLogs.create({
      ...user,
      penaltyTimeStamp: penalty
    });
    console.log('------ HANDLE AWAY -----');
    console.log({ list });
  }

  private async handleActive(user: IPresenceData) {
    let userFromDb = await db.table.userStatusLogs.findAll({
      limit: 1,
      where: {
        slackID: user.slackID
      },
      order: [['created_at', 'DESC']]
    });

    if (Array.isArray(userFromDb) && userFromDb.length != 0) {
      let user: IUserStatusLogModel = userFromDb[0].get();
      let lastAwayTS = time(user.penaltyTimeStamp);
      let minDiff = time.duration(time().diff(lastAwayTS)).asMinutes();

      const isAwayTSInWorkingHour = isWorkingHours(lastAwayTS.toMySqlDateTime());
      const isCurrentTSInWorkingHour = isWorkingHours();

      let timeSheet = new TimeSheet(minDiff, user);

      if (isAwayTSInWorkingHour && isAwayTSInWorkingHour) {
        timeSheet.activeAwayWH();
      }

      if (!(isAwayTSInWorkingHour && isCurrentTSInWorkingHour)) {
        timeSheet.activeAwayNWH();
      }

      if (isAwayTSInWorkingHour === true && isCurrentTSInWorkingHour === false) {
        timeSheet.activeNWHAwayWH();
      }

      if (isAwayTSInWorkingHour === false && isCurrentTSInWorkingHour === true) {
        timeSheet.activeWHAwayNWH();
      }
    }
  }
}
