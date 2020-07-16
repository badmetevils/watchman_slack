import { IUser } from './interface/model.d';
import userModel from './users.model';
import { Sequelize, ModelCtor } from 'sequelize';

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
  }
});

interface Idb {
  sequelize: typeof sequelize;
  dataType: typeof Sequelize;
  table: {
    user: ModelCtor<IUser>;
  };
}

const db: Idb = {
  sequelize,
  dataType: Sequelize,
  table: {
    user: userModel(sequelize)
  }
};

export default db;
