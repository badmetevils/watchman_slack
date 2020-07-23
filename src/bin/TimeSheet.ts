import db from '@models/index';
import { IUserStatusLogModel, IUserTimeLog, IUserTimeLogModel } from './../models/interface/model.d';
import logger from '@shared/Logger';
import { getTimeLogBySlackIDByDate } from '@models/queries';

export default class TimeSheet {
  minutes: number;
  user: IUserStatusLogModel;
  constructor(minutes: number, user: IUserStatusLogModel) {
    this.minutes = minutes;
    this.user = user;
  }

  public async log() {
    let userFromDb = await getTimeLogBySlackIDByDate(this.user.slackID);
    if (Array.isArray(userFromDb) && userFromDb.length !== 0) {
      let user: IUserTimeLogModel = userFromDb[0];
      this.updateUserTimeLog(user, 'awayInWorkingHours', this.minutes);
    } else {
      let entry: IUserTimeLog = {
        slackID: this.user.slackID,
        awayInWorkingHours: this.minutes
      };
      this.createNewTimeLog(entry);
    }
  }

  private async updateUserTimeLog(user: IUserTimeLogModel, key: keyof IUserTimeLog, minutes: number) {
    try {
      let record = await user.update({
        [key]: user.getDataValue(key) + minutes
      });
      if (!!record) {
        logger.info(`An entry updated for${record.getDataValue('slackID')} at table "${record.constructor.name} " `);
      }
    } catch (error) {
      logger.error(error);
    }
  }

  private async createNewTimeLog(user: IUserTimeLog) {
    try {
      let record = await db.table.userTimeLogs.create(user);
      if (!!record) {
        logger.info(
          `A new entry created for ${record.getDataValue('slackID')} at table "${record.constructor.name} " `
        );
      }
    } catch (error) {
      logger.error(error);
    }
  }
}
