import { WebAPICallResult } from '@slack/web-api';
import logger from '@shared/Logger';
import { watchman } from '@osl-slack-bolt';
import getUserList from './GetUserList';
import { IPresenceData } from '@typing/presence';

interface ICheckAwayStatus extends WebAPICallResult {
  presence?: 'active' | 'away';
  online?: true;
  auto_away?: false;
  manual_away?: false;
  connection_count?: number;
  last_activity?: number;
  id?: string;
  name?: string;
}

export class CheckAwayStatus {
  private response: IPresenceData[] = [];

  /**
   * @todo
   * ISSUE : facing unhandledPromiseRejection when sending parallel request.and resolving them in sequential
   * priority : lowest
   */

  async allMembers(): Promise<IPresenceData[] | undefined> {
    try {
      const list = (await getUserList()) || [];
      for (let { id } of list) {
        let status = await this.bySlackId(id);
        if (status?.ok) {
          let s = status.presence === 'active' ? ('ACTIVE' as 'ACTIVE') : ('AWAY' as 'AWAY');
          this.response.push({
            slackID: id,
            status: s
          });
        }
      }
      return this.response;
    } catch (error) {
      throw error;
    }
  }

  async bySlackId(id: string): Promise<ICheckAwayStatus | undefined> {
    try {
      return await watchman.client.users.getPresence({
        token: process.env.LEGACY_SLACK_BOT_TOKEN,
        user: id
      });
    } catch (error) {
      logger.error(`An error occurred when checking status via Bolt `);
    }
  }
}

export default new CheckAwayStatus();
