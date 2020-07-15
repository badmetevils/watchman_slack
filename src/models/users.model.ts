import db from './db';
import { STRING } from 'sequelize/types';

export default () =>
  db.define(
    'users',
    {
      slackID: {
        type: STRING,
        field: 'slack_id',
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: STRING,
        field: 'name',
        allowNull: false
      }
    },
    {
      freezeTableName: true
    }
  );
