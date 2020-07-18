import db from '..';
import logger from '@shared/Logger';
import { IUserStatusLogModel } from '@models/interface/model';

/**
 *Return  promise containing  most recent log status of user by slackID
 *
 * @param {string} slackID
 * @returns {(Promise<IUserStatusLogModel[] | undefined>)}
 */
const getMostRecentAwayStatusById = async (slackID: string): Promise<IUserStatusLogModel[] | undefined> => {
  try {
    return await db.table.userStatusLogs.findAll({
      limit: 1,
      where: {
        slackID: slackID
      },
      order: [['created_at', 'DESC']]
    });
  } catch (error) {
    logger.error(error);
  }
};

export default getMostRecentAwayStatusById;
