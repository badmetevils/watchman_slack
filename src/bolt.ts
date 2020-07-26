import { App } from '@slack/bolt';

const app = new App({
  token: process.env.LEGACY_SLACK_BOT_TOKEN,
  signingSecret: process.env.LEGACY_SLACK_SIGNING_SECRET
});

export { app as watchman };
