import { Sequelize, ModelCtor } from 'sequelize';
import userModel from './users.model';
import userTimeLogsModel from './userTimeLogs.model';
import userStatusLogModel from './userStatusLogs.model';
import { IUserModel, IUserTimeLogModel, IUserStatusLogModel } from './interface/model.d';
import winston from 'winston';

const {
  DB_USER = 'root',
  DB_PASSWORD = 'root',
  DB_NAME = 'test_db',
  DB_PORT = '3306',
  DB_HOST = 'localhost'
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: parseInt(DB_PORT),
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    idle: 10000
  },
  timezone: process.env.TIME_ZONE || 'Asia/Kolkata',
  dialectOptions: {
    useUTC: false,
    dateStrings: true,
    typeCast: true
  }
});

interface Idb {
  sequelize: typeof sequelize;
  dataType: typeof Sequelize;
  table: {
    user: ModelCtor<IUserModel>;
    userStatusLogs: ModelCtor<IUserStatusLogModel>;
    userTimeLogs: ModelCtor<IUserTimeLogModel>;
  };
}

const db: Idb = {
  sequelize,
  dataType: Sequelize,
  table: {
    user: userModel(sequelize),
    userStatusLogs: userStatusLogModel(sequelize),
    userTimeLogs: userTimeLogsModel(sequelize)
  }
};

export default db;
