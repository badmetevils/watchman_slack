import { Model } from 'sequelize/types';

export interface IUser {
  slackID: string;
  name: string;
}

export interface IUserStatusLog {
  slackID: string;
  date: string;
  status: 'ACTIVE' | 'AWAY';
  id: string;
  timestamp: string;
}

export interface IUserTimeLog {
  slackID: string;
  date: string;
  awayInWorkingHours: number;
  awayInNonWorkingHours: number;
}

export interface IUserModel extends Model, IUser {}

export interface IUserStatusLogModel extends Model, IUserStatusLog {}

export interface IUserTimeLogModel extends Model, IUserTimeLog {}
