import { Sequelize, DataTypes } from 'sequelize';
import { IUserStatusLogModel } from './interface/model';

const userStatusLogModel = (db: Sequelize) =>
  db.define<IUserStatusLogModel>(
    'user_time_logs',
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
        type: DataTypes.DATE,
        allowNull: false,
        field: 'date'
      },
      timestamp: {
        type: 'TIMESTAMP',
        field: 'timestamp'
      },
      status: {
        type: DataTypes.ENUM,
        values: ['ACTIVE', 'AWAY'],
        field: 'status'
      }
    },
    {
      // freezeTableName: true,
      timestamps: false,
      tableName: 'user_time_logs'
    }
  );

export default userStatusLogModel;
