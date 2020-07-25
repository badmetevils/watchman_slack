import Presence from '@bin/Presence';
import db from '@models/index';
import { IUser, IUserModel } from './../models/interface/model.d';
import { watchmanRTM } from '@osl-slack-rtm-app';
import { IMemberUserList } from '@typing/member';
import logger from '@shared/Logger';

interface ITeamJoined {
  user: IMemberUserList;
  type: 'team_join' | 'string';
}

export default class TeamJoined {
  public join() {
    watchmanRTM.on('team_join', async ({ user, type }: ITeamJoined) => {
      const { id, real_name, deleted, is_bot }: IMemberUserList = user;
      if (!is_bot && !deleted) {
        const newMember = await this.addNewUser({ slackID: id, name: real_name });
        if (!!newMember) {
          logger.info(
            `A new member ${newMember.getDataValue('name')} with id ${newMember.getDataValue(
              'slackID'
            )} has joined the team!`
          );
        }
        let presence = new Presence();
        await presence.subscribe();
        // await presence.listen();
      } else {
        logger.info(`A new bot ${real_name} added to the team`);
      }
    });
  }

  private async addNewUser(user: IUser): Promise<IUserModel | undefined> {
    try {
      return await db.table.user.create({ ...user });
    } catch (error) {
      logger.error(`An Error occurred when added a new member ${user.name}: ${user.slackID}`);
    }
  }
}
