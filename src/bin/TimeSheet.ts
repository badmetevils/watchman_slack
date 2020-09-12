import db from '@models/index';
import { IUserTimeLog, IUserTimeLogModel } from './../models/interface/model.d';
import logger from '@shared/Logger';
import { getTimeLogBySlackIDByDate } from '@models/queries';
import { IActiveAwayMinutes, IPresenceData } from '@typing/presence';

/**
 * @class TimeSheet
 */
export default class TimeSheet {
  private minutes: IActiveAwayMinutes;
  private user: IPresenceData;
  private isPenalized: boolean;
  /**
   * @description: Creates an instance of TimeSheet.
   * @param {IActiveAwayMinutes} minutes : provide time for { activeInNonWorkingHours , awayInWorkingHours}
   * @param {IPresenceData} user : user with the slackID and the status
   * @memberof TimeSheet
   */
  constructor(minutes: IActiveAwayMinutes, user: IPresenceData, isPenalized?: boolean) {
    this.minutes = minutes;
    this.user = user;
    this.isPenalized = isPenalized || false;
  }

  public async log() {
    const userFromDb = await getTimeLogBySlackIDByDate(this.user.slackID);
    if (Array.isArray(userFromDb) && userFromDb.length !== 0) {
      const user: IUserTimeLogModel = userFromDb[0];
      await this.updateUserTimeLog(user);
    } else {
      const entry: IUserTimeLog = {
        slackID: this.user.slackID,
        activeInNonWorkingHours: this.minutes.activeInNonWorkingHours,
        awayInWorkingHours: this.minutes.awayInWorkingHours,
        penaltyCount: this.isPenalized ? 1 : 0
      };
      await this.createNewTimeLog(entry);
    }
  }

  private async updateUserTimeLog(user: IUserTimeLogModel) {
    try {
      const activeInNonWorkingHours =
        this.minutes.activeInNonWorkingHours + parseFloat(user.getDataValue('activeInNonWorkingHours'));
      const awayInWorkingHours = this.minutes.awayInWorkingHours + parseFloat(user.getDataValue('awayInWorkingHours'));
      const penaltyCount = this.isPenalized
        ? parseInt(user.getDataValue('penaltyCount'), 10) + 1
        : parseInt(user.getDataValue('penaltyCount'), 10);

      const record = await user.update({
        activeInNonWorkingHours,
        awayInWorkingHours,
        penaltyCount
      });
      if (!!record) {
        logger.info(`An entry updated for ${record.getDataValue('slackID')} at table '${record.constructor.name}'`);
      }
    } catch (error) {
      logger.error(error);
    }
  }

  private async createNewTimeLog(user: IUserTimeLog) {
    try {
      const record = await db.table.userTimeLogs.create(user);
      if (!!record) {
        logger.info(`A new entry created for ${record.getDataValue('slackID')} at table '${record.constructor.name}'`);
      }
    } catch (error) {
      logger.error(error);
    }
  }
}
