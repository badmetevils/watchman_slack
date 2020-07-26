import ListenPresenceChange from '@watchman-rtm/ListenPresenceChange';
import SubscribePresence from '@watchman-rtm/SubscribePresence';

export default class Presence {
  public async listen() {
    const listen = new ListenPresenceChange();
    await listen.listen();
  }
  public async subscribe() {
    const subscribe = new SubscribePresence();
    await subscribe.allSlackUsers();
  }
}
