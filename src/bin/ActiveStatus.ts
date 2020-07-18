import TimeSheet from './TimeSheet';
import time from '@lib/time';
import { IUserStatusLogModel } from '@models/interface/model';
import { isWorkingHours, minutesFromNow } from '@shared/utils';
import { IPresenceData } from '@typing/presence';
import { getMostRecentAwayStatusById } from '@models/queries';

export default class ActiveStatus {
  user: IPresenceData;
  constructor(user: IPresenceData) {
    this.user = user;
  }

  async findAndUpdate() {
    let userFromDb = await getMostRecentAwayStatusById(this.user.slackID);
    if (Array.isArray(userFromDb) && userFromDb.length != 0) {
      let user: IUserStatusLogModel = userFromDb[0].get();
      await this.updateStatusByWorkHours(user);
    }
  }

  private async updateStatusByWorkHours(user: IUserStatusLogModel) {
    let lastAwayTS = time(user.penaltyTimeStamp);
    let minDiff = minutesFromNow(lastAwayTS);

    const isAwayTSInWorkingHour = isWorkingHours(lastAwayTS.toMySqlDateTime());
    const isCurrentTSInWorkingHour = isWorkingHours();

    let timeSheet = new TimeSheet(minDiff, user);

    if (isAwayTSInWorkingHour && isAwayTSInWorkingHour) {
      timeSheet.activeAwayWH();
    }

    if (!(isAwayTSInWorkingHour && isCurrentTSInWorkingHour)) {
      timeSheet.activeAwayNWH();
    }

    if (isAwayTSInWorkingHour === true && isCurrentTSInWorkingHour === false) {
      timeSheet.activeNWHAwayWH();
    }

    if (isAwayTSInWorkingHour === false && isCurrentTSInWorkingHour === true) {
      timeSheet.activeWHAwayNWH();
    }
  }
}
