import { RTMClient, LogLevel } from '@slack/rtm-api';

const token = process.env.LEGACY_SLACK_BOT_TOKEN || '';

export const watchmanRTM = new RTMClient(token, {
  useRtmConnect: true,
  //   logLevel: LogLevel.DEBUG,
  autoReconnect: true
});
