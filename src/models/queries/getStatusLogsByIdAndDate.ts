import db from '..';
import logger from '@shared/Logger';
import { IUserStatusLogModel } from '@models/interface/model';
import time from '@lib/time';

/**
 * Return  promise containing  logs of a user on a particular date
 * @param {string} slackID : user slack ID
 * @param { string} date : Date string in the format of  YYYY-MM-DD
 * @returns {(Promise<IUserStatusLogModel[] | undefined>)}
 */
const getStatusLogsByIdAndDate = async (slackID: string, date: string): Promise<IUserStatusLogModel[] | undefined> => {
  try {
    return await db.table.userStatusLogs.findAll({
      where: {
        slackID,
        date
      },
      order: [['created_at', 'DESC']]
    });
  } catch (error) {
    logger.error(error);
  }
};

export default getStatusLogsByIdAndDate;
