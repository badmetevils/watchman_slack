import { Model } from 'sequelize/types';

export interface IUser {
  slackID: string;
  name: string;
}

export interface IUserStatusLog {
  slackID: string;
  status: 'ACTIVE' | 'AWAY';
  id?: string;
  penaltyTimeStamp: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUserTimeLog {
  slackID: string;
  date?: string;
  awayInWorkingHours: number;
  awayInNonWorkingHours: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUserModel extends Model, IUser {}

export interface IUserStatusLogModel extends Model, IUserStatusLog {}

export interface IUserTimeLogModel extends Model, IUserTimeLog {}
