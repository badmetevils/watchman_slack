import { deleteStatusLogsByDate } from '@models/queries';
import cron from 'node-cron';
import logger from '@shared/Logger';
import time from '@lib/time';

export default class DeleteStatusLogs {
  public run() {
    // This will   run on 23:55 on every 1st of month 55 23 1 * *
    cron.schedule(
      '55 23 1 * *',
      async () => {
        try {
          const date = time().format('YYYY-MM-DD').toString();
          // console.log({ date });
          const record = await deleteStatusLogsByDate(date);
          if (!!record) {
            logger.info(`Delete ${record} status logs by Cron `);
          }
        } catch (error) {
          logger.error('An error occurred when deleting status logs  on cron');
        }
      },
      {
        scheduled: true,
        timezone: !!process.env.TIME_ZONE ? (process.env.TIME_ZONE as 'Asia/Kolkata') : 'Asia/Kolkata'
      }
    );
  }
}
