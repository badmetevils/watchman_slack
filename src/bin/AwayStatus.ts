import { IPresenceData } from '@typing/presence';
import time from '@lib/time';
import { getMostRecentStatusById, addUserStatusLog } from '@models/queries';
import { durationFromTimestampInMinutes, isWorkingHours, getMinutesWhenAway } from '@shared/utils';
import logger from '@shared/Logger';
import { Moment } from 'moment';
import TimeSheet from '@bin/TimeSheet';
import { isWorkHours } from '@shared/helper';

export default class AwayStatus {
  private user: IPresenceData;
  private penalty: number;

  constructor(user: IPresenceData) {
    this.user = user;
    this.penalty = parseInt(process.env.PENALTY_IN_SECONDS || '1800', 10);
  }

  async log() {
    const ts = await this.getPenaltyTimeStamp();
    if (!!ts) {
      const record = await addUserStatusLog({
        slackID: this.user.slackID,
        status: this.user.status,
        timestamp: ts.timeStamp,
        isPenalized: ts.isPenalized
      });
      if (!!record) {
        logger.info(
          `A  new 'AWAY' entry created for ${record.getDataValue('slackID')} at table '${
            record.constructor.name
          }'  on ${ts.timeStamp}`
        );
        this.updateTimeSheet();
      }
    }
  }

  private async updateTimeSheet() {
    const record = await this.getLastActive();
    if (!!record) {
      const timeToLog = getMinutesWhenAway(record.timeStamp);
      const timeSheet = new TimeSheet(timeToLog, this.user, record.isPenalized);
      await timeSheet.log();
      if (process.env.NODE_ENV === 'development') {
        console.log({
          user: this.user,
          record,
          lastActiveAt: record.timeStamp.toMySqlDateTime().toString(),
          timeToLog
        });
      }
    }
  }

  private async getLastActive(): Promise<{ timeStamp: Moment; isPenalized: boolean } | undefined> {
    try {
      const lastActiveRecord = await getMostRecentStatusById(this.user.slackID, 'ACTIVE');
      if (Array.isArray(lastActiveRecord) && lastActiveRecord.length !== 0) {
        const ts = lastActiveRecord[0].get('timestamp');
        const isPenalized = lastActiveRecord[0].get('isPenalized') || false;
        const timeStamp = time(ts);
        return {
          timeStamp,
          isPenalized
        };
      }
    } catch (error) {
      logger.error(error);
    }
  }

  private async getPenaltyTimeStamp(): Promise<{ timeStamp: string; isPenalized: boolean } | null> {
    const lastRecordById = await getMostRecentStatusById(this.user.slackID);
    let timeStamp = time().toMySqlDateTime().toString();
    let isPenalized = false;
    if (Array.isArray(lastRecordById) && lastRecordById.length !== 0) {
      const lastStatus = lastRecordById[0].get('status');
      /*
       * NOTE:
       * incase the last record was also "AWAY" we skip the update
       * this case arises when socket timeout and  there is a resubscription occur
       * This check avoid  false entry to  be record
       */

      if (lastStatus === 'AWAY') {
        return null;
      }

      /**
       * We only add penalty when there is a work hours going on
       */
      if (isWorkHours()) {
        try {
          // Incase user is went offline less then the twice the * penalty meaning * user is not auto away  since the last active status
          const recentActiveTimestamp = time(lastRecordById[0].get('timestamp'));
          const minDiff = durationFromTimestampInMinutes(recentActiveTimestamp);
          if (minDiff > (this.penalty + 60) / 60) {
            timeStamp = time().subtract(this.penalty, 'seconds').toMySqlDateTime().toString();
            isPenalized = true;
          }
        } catch (error) {
          logger.error(error);
        }
      }
      return { timeStamp, isPenalized };
    }
    return {
      timeStamp,
      isPenalized
    };
  }
}
