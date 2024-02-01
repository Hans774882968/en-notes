import { DataTypes } from 'sequelize';
import { sequelizeObject } from '../sequelizeObject';
import { timestampOptions } from '../const';

export const cnWord = sequelizeObject.define(
  'cn_word',
  {
    note: {
      type: DataTypes.TEXT
    },
    word: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING(100),
      unique: true
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
