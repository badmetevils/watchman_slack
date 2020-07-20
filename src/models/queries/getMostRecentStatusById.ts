import db from '..';
import logger from '@shared/Logger';
import { IUserStatusLogModel } from '@models/interface/model';
import time from '@lib/time';

/**
 *Return  promise containing  most recent log status of user by slackID
 *
 * @param {string} slackID : user slack ID
 * @param { 'ACTIVE' | 'AWAY'} status : user status active and away
 * @returns {(Promise<IUserStatusLogModel[] | undefined>)}
 */
const getMostRecentStatusById = async (
  slackID: string,
  status: 'ACTIVE' | 'AWAY'
): Promise<IUserStatusLogModel[] | undefined> => {
  try {
    return await db.table.userStatusLogs.findAll({
      limit: 1,
      where: {
        slackID: slackID,
        status,
        date: time().format('YYYY-MM-DD').toString()
      },
      order: [['created_at', 'DESC']]
    });
  } catch (error) {
    logger.error(error);
  }
};

export default getMostRecentStatusById;
