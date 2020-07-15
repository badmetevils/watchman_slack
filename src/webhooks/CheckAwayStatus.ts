import { WebAPICallResult } from '@slack/web-api';
import logger from '@shared/Logger';
import { watchman } from '@osl-slack-bolt';
import getUserList from './GetUserList';

interface ICheckAwayStatus extends WebAPICallResult {
  presence?: 'active' | 'away';
  online?: true;
  auto_away?: false;
  manual_away?: false;
  connection_count?: number;
  last_activity?: number;
}

class CheckAwayStatus {
  private response: ICheckAwayStatus[] = [];

  /**
   * @todo
   * ISSUE : facing unhandledPromiseRejection when sending parallel request.and resolving them in sequential
   * priority : lowest
   */

  async allMembers(): Promise<ICheckAwayStatus[] | undefined> {
    try {
      const list = (await getUserList()) || [];
      for (let { id, real_name, name } of list) {
        let status = await this.bySlackId(id);
        if (status.ok) {
          this.response.push({
            ...status,
            name,
            real_name
          });
        }
      }
      return this.response;
    } catch (error) {
      throw error;
    }
  }

  async bySlackId(id: string): Promise<ICheckAwayStatus> {
    return await watchman.client.users.getPresence({
      token: process.env.LEGACY_SLACK_USER_TOKEN,
      user: id
    });
  }
}

export default new CheckAwayStatus();
