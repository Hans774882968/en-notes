import { DataTypes } from 'sequelize';
import  { enWordRegex, timestampOptions } from '../const';
import { sequelizeObject } from '../sequelizeObject';

export const word = sequelizeObject.define(
  'word',
  {
    note: {
      type: DataTypes.TEXT
    },
    word: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING(60),
      unique: true,
      validate: {
        is: enWordRegex
      }
    }
  },
  {
    freezeTableName: true,
    indexes: [
      {
        fields: ['word'],
        unique: true
      }
    ],
    ...timestampOptions
  }
);
