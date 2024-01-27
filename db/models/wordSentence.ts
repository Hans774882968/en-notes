import  { onlyCtime } from '../const';
import { sequelizeObject } from '../sequelizeObject';

export const wordSentence = sequelizeObject.define(
  'word_sentence',
  {},
  {
    freezeTableName: true,
    indexes: [
      {
        fields: ['wordWord']
      },
      {
        fields: ['sentenceId']
      }
    ],
    ...onlyCtime
  }
);
