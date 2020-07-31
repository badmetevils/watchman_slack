import logger from '@shared/Logger';
import { RTMClient, LogLevel } from '@slack/rtm-api';

const token = process.env.LEGACY_SLACK_BOT_TOKEN || '';

export const watchmanRTM = new RTMClient(token, {
  logLevel: LogLevel.DEBUG,
  useRtmConnect: true
  // logger: {
  //   debug(...msg) {
  //     logger.log('debug', msg);
  //   },
  //   error(...msg) {
  //     logger.log('error', msg);
  //   },
  //   info(...msg) {
  //     logger.log('info', msg);
  //   },
  //   warn(...msg) {
  //     logger.log('warn', msg);
  //   },
  //   setLevel() {},
  //   setName() {},
  //   getLevel() {
  //     return LogLevel.DEBUG;
  //   }
  // }
});
