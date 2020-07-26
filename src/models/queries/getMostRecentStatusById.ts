import db from '..';
import logger from '@shared/Logger';
import { IUserStatusLogModel } from '@models/interface/model';
import time from '@lib/time';

/**
 * Return  promise containing  most recent log status of user by slackID
 * @example  SELECT * FROM *  watchman_db.user_status_logs *  where watchman_db.user_status_logs.slack_id="U016CN0U0AK" *  and status="ACTIVE" *  order by created_at desc * limit 1;
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
        slackID,
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
