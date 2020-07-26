import { IUser, IUserModel } from './../models/interface/model.d';
import db from '@models/index';
import getUserList from '@watchman-hooks/GetUserList';
import { watchmanRTM } from '@osl-slack-rtm-app';
import logger from '@shared/Logger';

export default class SubscribePresence {
  async allSlackUsers() {
    try {
      const list: IUserModel[] = await db.table.user.findAll();
      const listInDb: IUser[] = list.map(d => d.get());
      if (listInDb.length === 0) {
        this.storeUsers();
      } else {
        this.attachSubscriber(listInDb);
      }
    } catch (error) {
      logger.log('error', error);
    }
  }

  private async storeUsers() {
    try {
      const list = (await getUserList()) || [];
      const user: IUser[] = list.map(l => ({ slackID: l.id, name: l.real_name }));
      await db.table.user.bulkCreate(user);
      this.attachSubscriber(user);
    } catch (error) {
      logger.log('error', error);
    }
  }

  private attachSubscriber(list: { slackID: string }[]) {
    if (list?.length !== 0 && Array.isArray(list)) {
      const users = list?.map(d => d.slackID);
      watchmanRTM.subscribePresence(users);
    }
  }
}
