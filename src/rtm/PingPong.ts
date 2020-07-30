import { watchmanRTM } from '@osl-slack-rtm-app';

export default class MessageRTM {
  public async checkPing() {
    watchmanRTM.on('message', async event => {
      const { text, type, channel, user } = event;
      const userMentionRegex = new RegExp('<@[^>]+', 'gi');
      const messageRegex = new RegExp('ping', 'gi');
      const userMentions = text.match(userMentionRegex)?.join('_').replace('<@', '').split('_') || [];
      if (type === 'message' && messageRegex.test(text) && userMentions?.includes(process.env.BOT_SLACK_ID)) {
        watchmanRTM.sendMessage(`pong <@${user}>`, channel);
      }
    });
  }
}
