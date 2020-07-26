import logger from '@shared/Logger';
import { watchman } from '@osl-slack-bolt';
import { WebAPICallResult } from '@slack/web-api';
import { IMemberUserList } from '@typing/member';

interface IUserList extends WebAPICallResult {
  members?: IMemberUserList[];
}

export default async function getUserList(): Promise<IMemberUserList[] | undefined> {
  try {
    const result: IUserList = await watchman.client.users.list({
      token: process.env.LEGACY_SLACK_BOT_TOKEN
    });
    if (result.ok) {
      const members = result.members?.filter(d => !d.is_bot && !d.deleted);
      return members;
    }
  } catch (error) {
    throw error;
  }
}
