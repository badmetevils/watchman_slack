import { Op } from 'sequelize';
import db from '..';
import logger from '@shared/Logger';

/**
 * Return  promise containing  most recent log status of user by slackID
 * @param {string} date : Date up to which logs should be deleted [YYYY-MM-DD]
 * @returns {(Promise<number | undefined>)}
 */

const deleteStatusLogsByDate = async (date: string): Promise<number | undefined> => {
  try {
    return await db.table.userStatusLogs.destroy({
      where: {
        date: {
          [Op.lte]: date
        }
      }
    });
  } catch (error) {
    logger.error(error);
  }
};

export default deleteStatusLogsByDate;
