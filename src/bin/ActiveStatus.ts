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
    const timestamp = await this.getTimeStampToLog();
    if (!!timestamp) {
      const record = await addUserStatusLog({
        slackID: this.user.slackID,
        status: this.user.status,
        timestamp
      });
      if (!!record) {
        logger.info(
          `A new  'ACTIVE' entry created for ${record.getDataValue('slackID')} at table '${
            record.constructor.name
          }' on ${timestamp} `
        );
        this.updateTimeSheet();
      }
    }
  }

  private async updateTimeSheet() {
    const record = await this.getLastAway();
    if (!!record) {
      const timeToLog = getMinutesWhenActive(record.timeStamp);
      const timeSheet = new TimeSheet(timeToLog, this.user, record.isPenalized);
      await timeSheet.log();
      if (process.env.NODE_ENV === 'development') {
        console.log({
          user: this.user,
          record,
          lastAwayAt: record.timeStamp.toMySqlDateTime().toString(),
          timeToLog
        });
      }
    }
  }

  private async getLastAway(): Promise<{ timeStamp: Moment; isPenalized: boolean } | undefined> {
    try {
      const lastAwayRecord = await getMostRecentStatusById(this.user.slackID, 'AWAY');
      if (Array.isArray(lastAwayRecord) && lastAwayRecord.length !== 0) {
        const ts = lastAwayRecord[0].get('timestamp');
        const isPenalized = lastAwayRecord[0].get('isPenalized') || false;
        const timeStamp = time(ts).utcOffset(330).clone();
        return { timeStamp, isPenalized };
      }
    } catch (error) {
      logger.error(error);
    }
  }
  private async getTimeStampToLog(): Promise<string | null> {
    const timestamp = time().toMySqlDateTime().toString();
    const lastRecordById = await getMostRecentStatusById(this.user.slackID);
    if (Array.isArray(lastRecordById) && lastRecordById.length !== 0) {
      const lastStatus = lastRecordById[0].get('status');
      /*
       * NOTE:
       * incase the last record was also "ACTIVE" we skip the update
       * this case arises when socket timeout and  there is a resubscription occur
       * This check avoid  false entry to  be record
       */
      if (lastStatus === 'ACTIVE') {
        return null;
      }
      return timestamp;
    }
    return timestamp;
  }
}
