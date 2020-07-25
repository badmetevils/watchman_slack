import logger from '@shared/Logger';
import { watchmanRTM } from '@osl-slack-rtm-app';
import { watchman } from '@osl-slack-bolt';
import db from '@models/index';
import Presence from '@bin/Presence';
import TeamJoined from '@watchman-rtm/TeamJoined';
import runCronTask from './cron';

export default class Init {
  async connect() {
    await this.DatabaseConnect();
    await this.BoltConnect();
    await this.RTMConnect();
  }

  async start() {
    let presence = new Presence();
    await presence.subscribe();
    await presence.listen();
    let newMember = new TeamJoined();
    newMember.join();
    runCronTask();
  }

  private async DatabaseConnect() {
    try {
      let response = await db.sequelize.sync({ force: true });
      console.log('🆒 Database is connected and working fine');
    } catch (error) {
      console.log('😨 Database is not reachable');
      logger.log('error', error);
    }
  }

  private async RTMConnect() {
    try {
      const { self, team } = await watchmanRTM.start();
      console.log('🤠 Listening  to the RTM events ');
    } catch (error) {
      logger.error(error);
    }
  }

  private async BoltConnect() {
    try {
      const port = Number(process.env.PORT || 3000);
      await watchman.start(port);
      console.log(`⚡️ Bolt app is running! port ${port}`);
    } catch (error) {
      logger.error(error);
    }
  }
}
