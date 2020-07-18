import db from '@models/index';
import { IUserStatusLogModel, IUserTimeLog, IUserTimeLogModel } from './../models/interface/model.d';
import time from '@lib/time';

export default class TimeSheet {
  minutes: number;
  user: IUserStatusLogModel;
  constructor(minutes: number, user: IUserStatusLogModel) {
    this.minutes = minutes;
    this.user = user;
    console.log('----TIME SHEET INIT----');
    console.log({ minutes, user });
  }

  public async activeAwayWH() {
    console.log('----ACTIVE_AWAY_WH-----');

    let userFromDb = await db.table.userTimeLogs.findOne({
      where: {
        date: time().format('YYYY-MM-DD').toString(),
        slackID: this.user.slackID
      }
    });
    console.log({ foundUserInDb: userFromDb });
    if (Array.isArray(userFromDb) && userFromDb.length !== 0) {
      let user: IUserTimeLogModel = userFromDb[0];
      let updatedRecord = await user.update({
        awayInWorkingHours: user.awayInNonWorkingHours + this.minutes
      });
      console.log('---- UPDATED HOURS ----');
      console.log({ updatedRecord });
    } else {
      let entry: IUserTimeLog = {
        slackID: this.user.slackID,
        awayInWorkingHours: this.minutes,
        awayInNonWorkingHours: 0
      };
      console.log('--- NEW ENTRY --');
      let newEntry = await db.table.userTimeLogs.create(entry);
      console.log({ newEntry });
    }
  }

  public async activeAwayNWH() {
    console.log('----ACTIVE_AWAY_ NON_WH-----');

    let userFromDb = await db.table.userTimeLogs.findAll({
      where: {
        date: time().format('YYYY-MM-DD').toString(),
        slackID: this.user.slackID
      }
    });
    console.log({ foundUserInDb: userFromDb });
    if (Array.isArray(userFromDb) && userFromDb.length !== 0) {
      let user: IUserTimeLogModel = userFromDb[0];
      let updatedRecord = await user.update({
        awayInNonWorkingHours: user.awayInNonWorkingHours + this.minutes
      });
      console.log('---- UPDATED HOURS ----');
      console.log({ updatedRecord });
    } else {
      let entry: IUserTimeLog = {
        slackID: this.user.slackID,
        awayInWorkingHours: 0,
        awayInNonWorkingHours: this.minutes
      };
      console.log('--- NEW ENTRY --');
      let newEntry = await db.table.userTimeLogs.create(entry);
      console.log({ newEntry });
    }
  }
  public activeWHAwayNWH() {}
  public activeNWHAwayWH() {}
}
