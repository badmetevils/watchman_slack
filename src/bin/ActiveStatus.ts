import { getMinutesWhenActive } from '@shared/utils';
import { IPresenceData } from '@typing/presence';
import time from '@lib/time';
import { getMostRecentStatusById, addUserStatusLog } from '@models/queries';
import logger from '@shared/Logger';
import { Moment } from 'moment';
import TimeSheet from '@bin/TimeSheet';

export default class ActiveStatus {
  private user: IPresenceData;

  constructor(user: IPresenceData) {
    this.user = user;
  }

  async log() {
    const timestamp = time().toMySqlDateTime().toString();
    if (!!timestamp) {
      const record = await addUserStatusLog({
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
    const lastAwayTimeStamp: Moment | undefined = await this.getLastAway();

    if (!!lastAwayTimeStamp) {
      // console.log('==========ACTIVE=========');
      const timeToLog = getMinutesWhenActive(lastAwayTimeStamp);
      const timeSheet = new TimeSheet(timeToLog, this.user);
      await timeSheet.log();
      // console.log({
      //   lastAwayAt: lastAwayTimeStamp.toMySqlDateTime().toString(),
      //   timeToLog
      // });
    }
  }

  private async getLastAway(): Promise<Moment | undefined> {
    try {
      const lastAwayRecord = await getMostRecentStatusById(this.user.slackID, 'AWAY');
      if (Array.isArray(lastAwayRecord) && lastAwayRecord.length !== 0) {
        const recentAwayTimestamp = time(lastAwayRecord[0].timestamp);
        return recentAwayTimestamp;
      }
    } catch (error) {
      logger.error(error);
    }
  }
}
