import logger from '@shared/Logger';
import ListenPresenceChange from '@watchman-rtm/ListenPresenceChange';
import SubscribePresence from '@watchman-rtm/SubscribePresence';
import { updateArchiveStatusLogs } from '@models/queries';

export default class Presence {
  private archive: boolean;
  constructor(archive: boolean = false) {
    this.archive = archive;
  }

  public async listen() {
    const listen = new ListenPresenceChange();
    await listen.listen();
  }
  public async subscribe() {
    // archive all the records before subscribe
    if (this.archive) {
      await this.archiveStatusLogs();
    }
    const subscribe = new SubscribePresence();
    await subscribe.allSlackUsers();
  }

  private async archiveStatusLogs() {
    try {
      const records = await updateArchiveStatusLogs();
      if (Array.isArray(records)) {
        logger.info(`${records[0]} records has been archived`);
      }
    } catch (error) {
      logger.error('An error occurred while archiving the status logs');
    }
  }
}
