import './LoadEnv'; // Must be the first import

import logger from '@shared/Logger';
import { watchmanRTM } from '@osl-slack-rtm-app';
import { watchman } from '@osl-slack-bolt';
import { SubscribePresence } from '@watchman-rtm/SubscribePresence';
import { ListenPresenceChange } from '@watchman-rtm/ListenPresenceChange';

// SubscribePresence.allSlackUsers();
// ListenPresenceChange.listen();

(async () => {
  try {
    const { self, team, ...rest } = await watchmanRTM.start();
    console.log('🤠 Listening  to the RTM events ');
  } catch (error) {
    logger.error(error);
  }
})();

(async () => {
  try {
    const port = Number(process.env.PORT || 3000);
    await watchman.start(port);
    console.log(`⚡️ Bolt app is running! port ${port}`);
  } catch (error) {
    logger.error(error);
  }
})();
