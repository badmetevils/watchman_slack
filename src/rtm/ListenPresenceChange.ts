import { watchmanRTM } from '@osl-slack-rtm-app';

class ListenPresenceChange {
  async listen() {
    watchmanRTM.on('presence_change', event => {
      // console.log(`User: ${event.user} Presence: ${event.presence}`);
      console.log({ event });
    });
  }
}
const lp = new ListenPresenceChange();
export { lp as ListenPresenceChange };
