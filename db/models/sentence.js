import { DataTypes } from 'sequelize';
import { sequelizeObject } from '../sequelizeObject';
import { timestampOptions } from '../const';
import FlakeId from 'flake-idgen';
import intformat from 'biguint-format';

// there is no @types/biguint-format so this file remains ".js"

export function isLegalSentenceId(s) {
  return /^\d+$/.test(s);
}

const flakeIdgen = new FlakeId({ epoch: 1300000000000 });

// sentence 无法设为主键，也无法设为 unique
export const sentence = sequelizeObject.define(
  'sentence',
  {
    id: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: () => intformat(flakeIdgen.next(), 'dec'),
      primaryKey: true,
      type: DataTypes.BIGINT,
      unique: true
    },
    note: {
      type: DataTypes.TEXT
    },
    sentence: {
      allowNull: false,
      type: DataTypes.STRING(500)
    }
  },
  {
    freezeTableName: true,
    indexes: [
      {
        fields: ['id'],
        unique: true
      }
    ],
    ...timestampOptions
  }
);
