import { getMinutesWhenActive } from './../shared/utils';
import { IPresenceData } from '@typing/presence';
import time from '@lib/time';
import { getMostRecentStatusById, addUserStatusLog } from '@models/queries';
import { getMinutesWhenAway } from '@shared/utils';
import logger from '@shared/Logger';
import { Moment } from 'moment';

export default class ActiveStatus {
  private user: IPresenceData;

  constructor(user: IPresenceData) {
    this.user = user;
  }

  async log() {
    let timestamp = time().toMySqlDateTime().toString();
    if (!!timestamp) {
      let record = await addUserStatusLog({
        slackID: this.user.slackID,
        status: this.user.status,
        timestamp
      });
      if (Array.isArray(record)) {
        logger.info(`A new entry created for ${record.getDataValue('slackID')} at table "${record.constructor.name}" `);
      }
    }
  }

  async updateTimeSheet() {
    let lastAwayTimeStamp: Moment | undefined = await this.getLastAway();

    if (!!lastAwayTimeStamp) {
      console.log('==========ACTIVE=========');
      let timeToLog = getMinutesWhenActive(lastAwayTimeStamp);
      console.log({
        lastAwayAt: lastAwayTimeStamp.toMySqlDateTime().toString(),
        timeToLog
      });
    }
  }

  private async getLastAway(): Promise<Moment | undefined> {
    try {
      let lastAwayRecord = await getMostRecentStatusById(this.user.slackID, 'AWAY');
      if (Array.isArray(lastAwayRecord) && lastAwayRecord.length !== 0) {
        let recentAwayTimestamp = time(lastAwayRecord[0].timestamp);
        return recentAwayTimestamp;
      }
    } catch (error) {
      logger.error(error);
    }
  }
}
