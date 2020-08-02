import cron from 'node-cron';
import logger from '@shared/Logger';
import Presence from '@bin/Presence';

export default class StatusUpdateAt12 {
  public run() {
    // This will fetch status of all user at 12:05 AM on every day and record the entry

    cron.schedule(
      ' 0 05 0 * * * *',
      async () => {
        try {
          const presence = new Presence();
          await presence.subscribe();
          await presence.listen();
        } catch (error) {
          logger.error('An error occurred while resubscribing on cron');
        }
      },
      {
        scheduled: true,
        timezone: !!process.env.TIME_ZONE ? (process.env.TIME_ZONE as 'Asia/Kolkata') : 'Asia/Kolkata'
      }
    );
  }
}
