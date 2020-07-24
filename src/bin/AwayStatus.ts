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
    this.penalty = parseInt(process.env.PENALTY_IN_SECONDS || '1800');
  }

  async log() {
    let timestamp = await this.getPenaltyTimeStamp();
    if (!!timestamp) {
      let record = await addUserStatusLog({
        slackID: this.user.slackID,
        status: this.user.status,
        timestamp
      });
      if (!!record) {
        logger.info(`A new entry created for ${record.getDataValue('slackID')} at table "${record.constructor.name}" `);
      }
    }
  }

  async updateTimeSheet() {
    let lastActiveTimestamp: Moment | undefined = await this.getLastActive();

    if (!!lastActiveTimestamp) {
      console.log('==========AWAY=========');
      let timeToLog = getMinutesWhenAway(lastActiveTimestamp);
      let timeSheet = new TimeSheet(timeToLog, this.user);
      await timeSheet.log();
      console.log({
        lastActiveAt: lastActiveTimestamp.toMySqlDateTime().toString(),
        timeToLog
      });
    }
  }

  private async getLastActive(): Promise<Moment | undefined> {
    try {
      let lastActiveRecord = await getMostRecentStatusById(this.user.slackID, 'ACTIVE');
      if (Array.isArray(lastActiveRecord) && lastActiveRecord.length !== 0) {
        let recentActiveTimestamp = time(lastActiveRecord[0].timestamp);
        return recentActiveTimestamp;
      }
    } catch (error) {
      logger.error(error);
    }
  }

  private async getPenaltyTimeStamp(): Promise<string | undefined> {
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
