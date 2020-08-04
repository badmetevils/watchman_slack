import cron from 'node-cron';
import logger from '@shared/Logger';
import Presence from '@bin/Presence';

export default class StatusUpdateAt12 {
  public run() {
    // This will fetch status of all user at 12:05 AM on every day and record the entry
    //      ' 0 05 0 * * * *',

    cron.schedule(
      ' 0 05 0 * * * *',
      async () => {
        try {
          logger.info('re-subscribing over cron');
          const presence = new Presence();
          await presence.subscribe();
        } catch (error) {
          logger.error('An error occurred while re-subscribing over cron');
        }
      },
      {
        scheduled: true,
        timezone: !!process.env.TIME_ZONE ? (process.env.TIME_ZONE as 'Asia/Kolkata') : 'Asia/Kolkata'
      }
    );
  }
}
