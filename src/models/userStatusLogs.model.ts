import { Sequelize, DataTypes } from 'sequelize';
import { IUserStatusLogModel } from './interface/model';
import time from '@lib/time';
import userModel from './users.model';

const userStatusLogModel = (db: Sequelize) => {
  const statusLog = db.define<IUserStatusLogModel>(
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
      date: {
        type: DataTypes.DATEONLY,
        field: 'date',
        allowNull: false,
        defaultValue: () => time().format('YYYY-MM-DD').toString()
      },
      timestamp: {
        type: DataTypes.DATE,
        field: 'timestamp',
        get() {
          return time(this.getDataValue('timestamp')).toMySqlDateTime();
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
  statusLog.belongsTo(userModel(db), {
    foreignKey: 'slackID'
  });
  return statusLog;
};
export default userStatusLogModel;
