import { addUserStatusLog } from '@models/queries';
import cron from 'node-cron';
import CheckAwayStatus from '@watchman-hooks/CheckAwayStatus';
import logger from '@shared/Logger';
import { IPresenceData } from '@typing/presence';
import time from '@lib/time';

export default class StatusUpdateAt12 {
  public run() {
    // This will fetch status of all user at 12:05 AM on every day and record the entry

    cron.schedule(
      ' 0 05 0 * * * *',
      async () => {
        try {
          const userPresence: IPresenceData[] | undefined = await CheckAwayStatus.allMembers();
          if (!!userPresence) {
            for (const { slackID, status } of userPresence) {
              const timestamp = time().toMySqlDateTime().toString();
              const log = {
                slackID,
                status,
                timestamp
              };
              // console.log({ log });
              const record = await addUserStatusLog(log);
              if (!!record) {
                logger.info(
                  `A new entry created for ${record.getDataValue('slackID')} at table "${
                    record.constructor.name
                  }" Via Cron`
                );
              }
            }
          }
        } catch (error) {
          logger.error('An error occurred when fetching status on cron');
        }
      },
      {
        scheduled: true,
        timezone: !!process.env.TIME_ZONE ? (process.env.TIME_ZONE as 'Asia/Kolkata') : 'Asia/Kolkata'
      }
    );
  }
}
