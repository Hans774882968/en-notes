import  { onlyCtime } from '../const';
import { sequelizeObject } from '../sequelizeObject';

export const synonym = sequelizeObject.define(
  'synonym',
  {},
  {
    freezeTableName: true,
    indexes: [
      {
        fields: ['lhs']
      },
      {
        fields: ['rhs']
      }
    ],
    ...onlyCtime
  }
);
