import db from '..';
import logger from '@shared/Logger';
import { IUserTimeLogModel } from '@models/interface/model';
import time from '@lib/time';
import { Op, fn, col } from 'sequelize';

/**
 *  Get user  time log by  SlackId  between time ranges
 *
 * @param {string} slackID : user Slack Id against which query needs to be executed
 * @param {string} [startDate=time().format('YYYY-MM-DD').toString()] : start Date in format YYY-MM-DD
 * * @param {string} [endDate=time().format('YYYY-MM-DD').toString()] : end Date in format YYY-MM-DD
 * @returns {(Promise<IUserTimeLog[] | undefined>)} : sequelize modal object
 */

const aggregateTimeLogByISlackIDAndDateRange = async (
  slackID: string | null = null,
  startDate: string = time().format('YYYY-MM-DD').toString(),
  endDate: string = time().format('YYYY-MM-DD').toString()
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
      attributes: [
        [fn('sum', col('away_in_working_hours')), 'awayInWorkingHours'],
        [fn('sum', col('active_in_non_working_hours')), 'activeInNonWorkingHours']
      ],
      where,
      order: [['date', 'DESC']]
    });
  } catch (error) {
    // console.log(error);
    logger.error(error);
  }
};

export default aggregateTimeLogByISlackIDAndDateRange;
