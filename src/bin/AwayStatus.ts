import { IPresenceData } from '@typing/presence';
import time from '@lib/time';
import { getMostRecentStatusById } from '@models/queries';
import { durationFromTimestampInMinutes, isWorkingHours } from '@shared/utils';
import logger from '@shared/Logger';

export default class AwayStatus {
  user: IPresenceData;
  penalty: number;

  constructor(user: IPresenceData) {
    this.user = user;
    this.penalty = parseInt(process.env.PENALTY_IN_SECONDS || '1800');
  }

  async log() {
    let timestamp = await this.getTimeStampForLogging();
    if (isWorkingHours(timestamp)) {
      // check last active status for today if found  :  recent_active_ts [is from nh1] to start_wh  add then to active non wh for today
      // if no recent active status found  just log them
    } else {
      /**
       *  if   AWAY_NH1
       *        find last active   then active_nh =  last recent _active to current away
       * if AWAY_NH2
       *     find last active
       *             if  last active is from wh
       *                     active_time_nh =  endtime to current away_ts
       *              if recent_away  in nh1
       *                    active_time_nh =  recent_away to start + end to current away
       * */
    }
  }

  private async getTimeStampForLogging(): Promise<string | undefined> {
    let timestamp = time().subtract(this.penalty, 'seconds').toMySqlDateTime().toString();
    try {
      let lastAwayRecord = await getMostRecentStatusById(this.user.slackID, 'AWAY');
      if (Array.isArray(lastAwayRecord) && lastAwayRecord.length !== 0) {
        let recentAwayTimestamp = time(lastAwayRecord[0].timestamp);
        let minDiff = durationFromTimestampInMinutes(recentAwayTimestamp);
        if (minDiff < (2 * this.penalty) / 60) {
          timestamp = time().toMySqlDateTime().toString();
        }
      }
      return timestamp;
    } catch (error) {
      logger.error(error);
    }
  }
}
