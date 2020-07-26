import db from '..';
import logger from '@shared/Logger';
import { IUserModel } from '@models/interface/model';

/**
 *  @description : Return all user stored users table
 * @returns {(Promise<IUserModel | undefined>)}
 */
const getAllUsers = async (): Promise<IUserModel[] | undefined> => {
  try {
    const record = await db.table.user.findAll();
    return record;
  } catch (error) {
    logger.error(error);
  }
};

export default getAllUsers;
