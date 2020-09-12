import { Sequelize, DataTypes } from 'sequelize';
import { IUserStatusLogModel } from './interface/model';
import time from '@lib/time';
import userModel from './users.model';
import moment from 'moment-timezone';

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
          const t = time(this.getDataValue('timestamp'));
          return time(t.clone().utcOffset(0, false)).clone().utcOffset(330, false).toMySqlDateTime().toString();
        },
        set(valueToBeSet: string) {
          const value = time(valueToBeSet).utcOffset(330, false).toMySqlDateTime().toString();
          return this.setDataValue('timestamp', value);
        }
      },
      status: {
        type: DataTypes.ENUM,
        values: ['ACTIVE', 'AWAY'],
        field: 'status'
      },
      isArchived: {
        type: DataTypes.BOOLEAN,
        field: 'is_archive',
        defaultValue: false
      },
      isPenalized: {
        type: DataTypes.BOOLEAN,
        field: 'is_penalized',
        defaultValue: false
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
