import db from '..';
import logger from '@shared/Logger';
import { IUserStatusLogModel } from '@models/interface/model';

/**
 * Return  Archive all the status logs
 * @returns {(Promise<[number, IUserStatusLogModel[]] | undefined>)}
 */
const updateArchiveStatusLogs = async (): Promise<[number, IUserStatusLogModel[]] | undefined> => {
  try {
    return await db.table.userStatusLogs.update(
      {
        isArchived: true
      },
      {
        where: {
          isArchived: false
        }
      }
    );
  } catch (error) {
    logger.error(error);
  }
};

export default updateArchiveStatusLogs;
