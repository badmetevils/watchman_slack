import getUserList from '@watchman-hooks/GetUserList';
import { watchmanRTM } from '@osl-slack-rtm-app';

class SubscribePresence {
  async allSlackUsers() {
    let list = await getUserList();
    // console.log({ list });
    if (list?.length !== 0 && Array.isArray(list)) {
      let users = list?.map(d => d.id);
      watchmanRTM.subscribePresence(users);
    }
  }
}

let sp = new SubscribePresence();
export { sp as SubscribePresence };
