import { App } from '@slack/bolt';
import logger from '@shared/Logger';

const app = new App({
  token: process.env.LEGACY_SLACK_BOT_TOKEN,
  signingSecret: process.env.LEGACY_SLACK_SIGNING_SECRET
});

// if (!(process.env.NODE_ENV === 'production')) {
//   logger.info(
//     JSON.stringify({
//       token: process.env.SLACK_BOT_TOKEN,
//       secret: process.env.SLACK_SIGNING_SECRET
//     })
//   );
// }

export { app as watchman };
