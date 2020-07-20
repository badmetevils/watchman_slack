import db from '..';
import logger from '@shared/Logger';
import { IUserTimeLogModel } from '@models/interface/model';
import time from '@lib/time';

/**
 *  Get user  time log by  SlackId  it will return user for current date default
 *
 * @param {string} slackID : user Slack Id against which query needs to be executed
 * @param {string} [date=time().format('YYYY-MM-DD').toString()] : Provide date string in format YYYY-MM-DD
 * @returns {(Promise<IUserTimeLog[] | undefined>)} : sequelize modal object
 */
const getTimeLogBySlackIDByDate = async (
  slackID: string,
  date: string = time().format('YYYY-MM-DD').toString()
): Promise<IUserTimeLogModel[] | undefined> => {
  try {
    return await db.table.userTimeLogs.findAll({
      where: { date, slackID }
    });
  } catch (error) {
    logger.error(error);
  }
};

export default getTimeLogBySlackIDByDate;
