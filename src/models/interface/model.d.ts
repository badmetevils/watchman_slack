import { Model } from 'sequelize/types';

export interface IUser extends Model {
  slackID: string;
  name: string;
}
