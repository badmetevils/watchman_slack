import logger from '@shared/Logger';
import { watchman } from '@osl-slack-bolt';
import { WebAPICallResult } from '@slack/web-api';
import { IMemberUserList } from '@typing/member';

interface IUserList extends WebAPICallResult {
  members?: Array<IMemberUserList>;
}

export default async function getUserList(): Promise<Array<IMemberUserList> | undefined> {
  try {
    let result: IUserList = await watchman.client.users.list({
      token: process.env.LEGACY_SLACK_BOT_TOKEN
    });
    if (result.ok) {
      let members = result.members?.filter(d => !d.is_bot && !d.deleted);
      return members;
    }
  } catch (error) {
    throw error;
  }
}
