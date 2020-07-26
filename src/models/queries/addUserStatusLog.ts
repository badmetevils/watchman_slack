import db from '..';
import logger from '@shared/Logger';
import { IUserStatusLogModel, IUserStatusLog } from '@models/interface/model';

/**
 * @description: Return  promise containing  added user record
 * @param {IUserStatusLog} user : user slack ID
 * @returns {(Promise<IUserStatusLogModel | undefined>)}
 */
const addUserStatusLog = async (user: IUserStatusLog): Promise<IUserStatusLogModel | undefined> => {
  try {
    const record = await db.table.userStatusLogs.create(user);
    return record;
  } catch (error) {
    logger.error(error);
  }
};

export default addUserStatusLog;
