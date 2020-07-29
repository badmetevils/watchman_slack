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
  slackID: string | null = null,
  startDate: string = time().format('YYYY-MM-DD').toString(),
  endDate: string = time().format('YYYY-MM-DD').toString(),
  limit: number = 10,
  offset: number = 0
): Promise<IUserTimeLogModel[] | undefined> => {
  try {
    const where = {
      date: {
        [Op.between]: [startDate, endDate]
      }
    };
    if (!!slackID) {
      // @ts-ignore
      where.slackID = slackID;
    }
    return await db.table.userTimeLogs.findAll({
      limit,
      offset,
      where,
      include: [{ model: db.table.user, attributes: ['name'], nested: true }]
    });
  } catch (error) {
    // console.log(error);
    logger.error(error);
  }
};

export default getTimeLogByISlackIDAndDateRange;
