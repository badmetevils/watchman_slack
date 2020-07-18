import { Sequelize, DataTypes } from 'sequelize';
import { IUserStatusLogModel } from './interface/model';
import time from '@lib/time';

const userStatusLogModel = (db: Sequelize) =>
  db.define<IUserStatusLogModel>(
    'user_status_logs',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
      },
      slackID: {
        type: DataTypes.STRING,
        field: 'slack_id',
        allowNull: false
      },
      penaltyTimeStamp: {
        type: DataTypes.DATE,
        field: 'penalty_time_stamp',
        get() {
          return time(this.getDataValue('penaltyTimeStamp')).toMySqlDateTime();
        }
      },
      status: {
        type: DataTypes.ENUM,
        values: ['ACTIVE', 'AWAY'],
        field: 'status'
      }
    },
    {
      // freezeTableName: true,
      // timestamps: false,
      tableName: 'user_status_logs',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

export default userStatusLogModel;
