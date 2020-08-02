import { IPresenceData } from '@typing/presence';
import time from '@lib/time';
import { getMostRecentStatusById, addUserStatusLog } from '@models/queries';
import { durationFromTimestampInMinutes, isWorkingHours, getMinutesWhenAway } from '@shared/utils';
import logger from '@shared/Logger';
import { Moment } from 'moment';
import TimeSheet from '@bin/TimeSheet';

export default class AwayStatus {
  private user: IPresenceData;
  private penalty: number;

  constructor(user: IPresenceData) {
    this.user = user;
    this.penalty = parseInt(process.env.PENALTY_IN_SECONDS || '1800', 10);
  }

  async log() {
    const timestamp = await this.getPenaltyTimeStamp();
    if (!!timestamp) {
      const record = await addUserStatusLog({
        slackID: this.user.slackID,
        status: this.user.status,
        timestamp
      });
      if (!!record) {
        logger.info(
          `A  new "AWAY" entry created for ${record.getDataValue('slackID')} at table "${
            record.constructor.name
          }"  on ${timestamp}`
        );
      }
    }
  }

  async updateTimeSheet() {
    const lastActiveTimestamp: Moment | undefined = await this.getLastActive();

    if (!!lastActiveTimestamp) {
      const timeToLog = getMinutesWhenAway(lastActiveTimestamp);
      const timeSheet = new TimeSheet(timeToLog, this.user);
      await timeSheet.log();
      if (process.env.NODE_ENV === 'development') {
        console.log({
          user: this.user,
          m: lastActiveTimestamp,
          lastActiveAt: lastActiveTimestamp.toMySqlDateTime().toString(),
          timeToLog
        });
      }
    }
  }

  private async getLastActive(): Promise<Moment | undefined> {
    try {
      const lastActiveRecord = await getMostRecentStatusById(this.user.slackID, 'ACTIVE');
      if (Array.isArray(lastActiveRecord) && lastActiveRecord.length !== 0) {
        const ts = lastActiveRecord[0].get('timestamp');
        const recentActiveTimestamp = time(ts);
        return recentActiveTimestamp;
      }
    } catch (error) {
      logger.error(error);
    }
  }

  private async getPenaltyTimeStamp(): Promise<string | undefined> {
    let timestamp = time().subtract(this.penalty, 'seconds').toMySqlDateTime().toString();
    try {
      const lastAwayRecord = await getMostRecentStatusById(this.user.slackID, 'AWAY');
      if (Array.isArray(lastAwayRecord) && lastAwayRecord.length !== 0) {
        const recentAwayTimestamp = time(lastAwayRecord[0].timestamp);
        const minDiff = durationFromTimestampInMinutes(recentAwayTimestamp);
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
