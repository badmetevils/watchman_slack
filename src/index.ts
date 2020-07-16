import './LoadEnv'; // Must be the first import

import logger from '@shared/Logger';
import { watchmanRTM } from '@osl-slack-rtm-app';
import { watchman } from '@osl-slack-bolt';
import { SubscribePresence } from '@watchman-rtm/SubscribePresence';
import { ListenPresenceChange } from '@watchman-rtm/ListenPresenceChange';
import db from '@models/index';

// setting up the database
(async () => {
  try {
    let response = await db.sequelize.sync();
    console.log('🆒 Database is connected and working fine');
  } catch (error) {
    console.log('😨 Database is not reachable');
    logger.log('error', error);
  }
})();

// Booting up the RTM services
(async () => {
  try {
    const { self, team, ...rest } = await watchmanRTM.start();
    console.log('🤠 Listening  to the RTM events ');
  } catch (error) {
    logger.error(error);
  }
})();

// Booting up the connection for webAPI communication

(async () => {
  try {
    const port = Number(process.env.PORT || 3000);
    await watchman.start(port);
    console.log(`⚡️ Bolt app is running! port ${port}`);
  } catch (error) {
    logger.error(error);
  }
})();
