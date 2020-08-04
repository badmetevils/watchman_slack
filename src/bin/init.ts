import logger from '@shared/Logger';
import { watchmanRTM } from '@osl-slack-rtm-app';
import { watchman } from '@osl-slack-bolt';
import db from '@models/index';
import Presence from '@bin/Presence';
import TeamJoined from '@watchman-rtm/TeamJoined';
import runCronTask from './cron';
import ExpressServer from '@express-app/Server';
import MessageRTM from '@watchman-rtm/PingPong';

export default class Init {
  async connect() {
    await this.DatabaseConnect();
    await this.BoltConnect();
    await this.RTMConnect();
    this.APIServer();
  }

  async start() {
    const pingPong = new MessageRTM();
    pingPong.checkPing();
    runCronTask();
    this.handleSubscribeOnRTMConnect();
    const presence = new Presence();
    await presence.listen();
    const newMember = new TeamJoined();
    newMember.join();
  }

  private handleSubscribeOnRTMConnect() {
    watchmanRTM.on('hello', async event => {
      logger.info(`Received 'hello' event  re-subscribing to the presence of users`);
      const presence = new Presence();
      await presence.subscribe();
    });
  }
  private async DatabaseConnect() {
    try {
      const response = await db.sequelize.sync({ force: process.env.NODE_ENV === 'development' });
      console.log('🛹  Database is connected and working fine');
    } catch (error) {
      console.log('🤷‍♂️  Database is not reachable');
      logger.error(error);
    }
  }

  private async RTMConnect() {
    try {
      // batch_presence_aware : seems not be working as of now
      const { self, team } = await watchmanRTM.start();
      console.log(`🚀  Listening  to the RTM events`);
    } catch (error) {
      console.log(`😫  Unable to connect with  RTM events `);
      logger.error(error);
    }
  }

  private async BoltConnect() {
    try {
      const port = Number(process.env.PORT || 3000);
      await watchman.start(port);
      console.log(`⚡  Bolt app is running! port ${port}`);
    } catch (error) {
      console.log(`😵  Unable to connect to slack via Bolt`);
      logger.error(error);
    }
  }

  private APIServer() {
    const port = Number(process.env.EXPRESS_PORT || 3000);
    ExpressServer.listen(port, () => {
      console.log(`🧪  API Server is running on ${port}`);
    });
  }
}
