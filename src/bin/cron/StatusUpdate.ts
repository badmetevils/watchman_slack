import cron from 'node-cron';
import logger from '@shared/Logger';
import Presence from '@bin/Presence';

export default class StatusUpdateAt12 {
  public run() {
    // This will fetch status of all user at At minute 5 past every 8th hour.

    cron.schedule(
      '5 */8 * * *',
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
