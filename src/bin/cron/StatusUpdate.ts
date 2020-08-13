import cron from 'node-cron';
import logger from '@shared/Logger';
import Presence from '@bin/Presence';

export default class StatusUpdateAt12 {
  public run() {
    // This will fetch status of all user at 11:58 PM on every day and record the entry

    cron.schedule(
      ' 0 55 23 * * * *',
      async () => {
        try {
          logger.info('re-subscribing over cron');
          const presence = new Presence(true);
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
