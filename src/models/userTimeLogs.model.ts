import { Sequelize, DataTypes } from 'sequelize';
import { IUserTimeLogModel } from './interface/model';
import time from '@lib/time';
import userModel from './users.model';

const userTimeLogsModel = (db: Sequelize) => {
  const timeLogs = db.define<IUserTimeLogModel>(
    'user_time',
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
      activeInNonWorkingHours: {
        type: DataTypes.FLOAT,
        field: 'active_in_non_working_hours',
        defaultValue: 0,
        set(valueToBeSet: number) {
          return this.setDataValue('activeInNonWorkingHours', Math.round(valueToBeSet));
        }
      },
      penaltyCount: {
        type: DataTypes.FLOAT,
        field: 'penalty_count',
        defaultValue: 0
      }
    },
    {
      tableName: 'user_time',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
  timeLogs.belongsTo(userModel(db), {
    foreignKey: 'slackID'
  });
  return timeLogs;
};

export default userTimeLogsModel;
