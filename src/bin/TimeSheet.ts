import db from '@models/index';
import { IUserStatusLogModel, IUserTimeLog, IUserTimeLogModel } from './../models/interface/model.d';
import logger from '@shared/Logger';
import { getTimeLogBySlackIDByDate } from '@models/queries';
import { IActiveAwayMinutes, IPresenceData } from '@typing/presence';

/**
 * @class TimeSheet
 */
export default class TimeSheet {
  private minutes: IActiveAwayMinutes;
  private user: IPresenceData;
  /**
   *Creates an instance of TimeSheet.
   * @param {IActiveAwayMinutes} minutes : provide time for { activeInNonWorkingHours , awayInWorkingHours}
   * @param {IPresenceData} user : user with the slackID and the status
   * @memberof TimeSheet
   */
  constructor(minutes: IActiveAwayMinutes, user: IPresenceData) {
    this.minutes = minutes;
    this.user = user;
  }

  public async log() {
    let userFromDb = await getTimeLogBySlackIDByDate(this.user.slackID);
    if (Array.isArray(userFromDb) && userFromDb.length !== 0) {
      let user: IUserTimeLogModel = userFromDb[0];
      this.updateUserTimeLog(user, this.minutes);
    } else {
      let entry: IUserTimeLog = {
        slackID: this.user.slackID,
        activeInNonWorkingHours: this.minutes.activeInNonWorkingHours,
        awayInWorkingHours: this.minutes.awayInWorkingHours
      };
      this.createNewTimeLog(entry);
    }
  }

  private async updateUserTimeLog(user: IUserTimeLogModel, logs: IActiveAwayMinutes) {
    try {
      let activeInNonWorkingHours = logs.activeInNonWorkingHours + user.getDataValue('activeInNonWorkingHours');
      let awayInWorkingHours = logs.awayInWorkingHours + user.getDataValue('awayInWorkingHours');
      let record = await user.update({
        activeInNonWorkingHours,
        awayInWorkingHours
      });
      if (!!record) {
        logger.info(`An entry updated for ${record.getDataValue('slackID')} at table "${record.constructor.name}" `);
      }
    } catch (error) {
      logger.error(error);
    }
  }

  private async createNewTimeLog(user: IUserTimeLog) {
    try {
      let record = await db.table.userTimeLogs.create(user);
      if (!!record) {
        logger.info(`A new entry created for ${record.getDataValue('slackID')} at table "${record.constructor.name}" `);
      }
    } catch (error) {
      logger.error(error);
    }
  }
}
