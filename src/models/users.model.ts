import { Sequelize, DataTypes } from 'sequelize';
import { IUser } from './interface/model';

const userModel = (db: Sequelize) =>
  db.define<IUser>(
    'users',
    {
      slackID: {
        type: DataTypes.STRING,
        field: 'slack_id',
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        field: 'name',
        allowNull: false
      }
    },
    {
      freezeTableName: true,
      timestamps: false,
      tableName: 'user'
    }
  );

export default userModel;
