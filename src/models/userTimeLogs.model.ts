import { Sequelize, DataTypes } from 'sequelize';
import { IUserTimeLogModel } from './interface/model';

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
        type: DataTypes.DATE,
        allowNull: false,
        field: 'date'
      },
      awayInWorkingHours: {
        type: DataTypes.TIME,
        field: 'away_in_working_hours'
      },
      awayInNonWorkingHours: {
        type: DataTypes.TIME,
        field: 'away_in_non_working_hours'
      }
    },
    {
      // freezeTableName: true,
      timestamps: false,
      tableName: 'user_time'
    }
  );

export default userTimeLogsModel;
