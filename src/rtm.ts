import { RTMClient, LogLevel } from '@slack/rtm-api';

const token = process.env.LEGACY_SLACK_BOT_TOKEN || '';

export const watchmanRTM = new RTMClient(token, {
  // logLevel: process.env.NODE_ENV === 'production' ? LogLevel.ERROR : LogLevel.DEBUG,
  useRtmConnect: true,
  autoReconnect: true
});
