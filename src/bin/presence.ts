import ListenPresenceChange from '@watchman-rtm/ListenPresenceChange';
import SubscribePresence from '@watchman-rtm/SubscribePresence';

export default class Presence {
  public async listen() {
    let listen = new ListenPresenceChange();
    await listen.listen();
  }
  public async subscribe() {
    let subscribe = new SubscribePresence();
    await subscribe.allSlackUsers();
  }
}
