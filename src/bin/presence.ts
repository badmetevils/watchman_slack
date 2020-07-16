import ListenPresenceChange from '@watchman-rtm/ListenPresenceChange';
import SubscribePresence from '@watchman-rtm/SubscribePresence';

export default class Presence {
  public listen() {
    let listen = new ListenPresenceChange();
    listen.listen();
  }
  public subscribe() {
    let subscribe = new SubscribePresence();
    subscribe.allSlackUsers();
  }
}
