import db from '..';
import logger from '@shared/Logger';
import { IUserTimeLogModel } from '@models/interface/model';
import time from '@lib/time';
import { Op } from 'sequelize';

/**
 *  Get user  time log by  SlackId  between time ranges
 *
 * @param {string} slackID : user Slack Id against which query needs to be executed
 * @param {string} [startDate=time().format('YYYY-MM-DD').toString()] : start Date in format YYY-MM-DD
 * * @param {string} [endDate=time().format('YYYY-MM-DD').toString()] : end Date in format YYY-MM-DD
 * @returns {(Promise<IUserTimeLog[] | undefined>)} : sequelize modal object
 */
const getTimeLogByISlackIDAndDateRange = async (
  slackID: string,
  startDate: string = time().format('YYYY-MM-DD').toString(),
  endDate: string = time().format('YYYY-MM-DD').toString()
): Promise<IUserTimeLogModel[] | undefined> => {
  try {
    return await db.table.userTimeLogs.findAll({
      where: {
        slackID,
        date: {
          [Op.between]: [startDate, endDate]
        }
      }
    });
  } catch (error) {
    logger.error(error);
  }
};

export default getTimeLogByISlackIDAndDateRange;
