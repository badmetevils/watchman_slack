import { Sequelize, DataTypes } from 'sequelize';
import { IUserTimeLogModel } from './interface/model';
import time from '@lib/time';

const userTimeLogsModel = (db: Sequelize) =>
  db.define<IUserTimeLogModel>(
    'user_time',
    {
      slackID: {
        type: DataTypes.STRING,
        field: 'slack_id',
        allowNull: false
      },
      date: {
        type: DataTypes.DATEONLY,
        field: 'date',
        allowNull: false,
        defaultValue: () => time().format('YYYY-MM-DD').toString()
      },
      awayInWorkingHours: {
        type: DataTypes.FLOAT,
        field: 'away_in_working_hours',
        defaultValue: 0,
        set(valueToBeSet: number) {
          return this.setDataValue('awayInWorkingHours', Math.round(valueToBeSet));
        }
      },
      awayInNonWorkingHours: {
        type: DataTypes.FLOAT,
        field: 'away_in_non_working_hours',
        defaultValue: 0,
        set(valueToBeSet: number) {
          console.log({ v: valueToBeSet });
          return this.setDataValue('awayInNonWorkingHours', Math.round(valueToBeSet));
        }
      }
    },
    {
      tableName: 'user_time',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

export default userTimeLogsModel;
