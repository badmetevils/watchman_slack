import logger from '@shared/Logger';
import { watchmanRTM } from '@osl-slack-rtm-app';
import { watchman } from '@osl-slack-bolt';
import db from '@models/index';
import Presence from '@bin/Presence';
import TeamJoined from '@watchman-rtm/TeamJoined';
import runCronTask from './cron';
import ExpressServer from '@express-app/Server';

export default class Init {
  async connect() {
    await this.DatabaseConnect();
    await this.BoltConnect();
    await this.RTMConnect();
    this.APIServer();
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
      let response = await db.sequelize.sync({ force: false });
      console.log('🆒 Database is connected and working fine');
    } catch (error) {
      console.log('😨 Database is not reachable');
      console.log(error);
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

  private APIServer() {
    const port = Number(process.env.EXPRESS_PORT || 3000);
    ExpressServer.listen(port, () => {
      console.log(`😆 API Server is running on ${port}`);
    });
  }
}
