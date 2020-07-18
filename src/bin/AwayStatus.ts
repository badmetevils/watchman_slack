import { IUserStatusLog } from './../models/interface/model.d';
import time from '@lib/time';
import logger from '@shared/Logger';
import db from '@models/index';
import { minutesFromNow } from './../shared/utils';
import { IPresenceData } from '@typing/presence';
import { getMostRecentAwayStatusById } from '@models/queries';

export default class AwayStatus {
  user: IPresenceData;
  penalty: number;
  constructor(user: IPresenceData) {
    this.user = user;
    this.penalty = parseInt(process.env.PENALTY_IN_SECONDS || '1800');
  }

  async set() {
    let penaltyTimeStamp = time().subtract(this.penalty, 'seconds').toMySqlDateTime().toString();
    try {
      let user = await getMostRecentAwayStatusById(this.user.slackID);
      if (Array.isArray(user) && user.length !== 0) {
        let lastAwayTS = time(user[0].penaltyTimeStamp);
        let minDiff = minutesFromNow(lastAwayTS);
        console.log({ minDiff });
        if (minDiff < (2 * this.penalty) / 60) {
          penaltyTimeStamp = time().toMySqlDateTime().toString();
        }
      }
      this.addUserLog({
        ...this.user,
        penaltyTimeStamp
      });
    } catch (error) {
      logger.error(error);
    }
  }

  private async addUserLog(user: IUserStatusLog) {
    try {
      let list = await db.table.userStatusLogs.create(user);
      console.log({ userAway: list });
    } catch (error) {
      logger.error(error);
    }
  }
}
