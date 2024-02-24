import { Model } from 'sequelize';
import { Sentence } from '@/db/models/types';

export function calcWordComplexity(item: Model<any, any>) {
  const noteLength: number = (item.getDataValue('note') || '').length;
  const sentences: Sentence[] = item.getDataValue('sentences');
  const sentenceTotalLength = sentences.reduce((tot, item) => tot + item.sentence.length, 0);
  return noteLength + sentenceTotalLength;
}

export function calcCnWordComplexity(item: Model<any, any>) {
  const wordLength: number = (item.getDataValue('word') || '').length;
  const noteLength: number = (item.getDataValue('note') || '').length;
  return wordLength + noteLength;
}

export function calcSentenceComplexity(item: Model<any, any>) {
  const sentenceLength: number = (item.getDataValue('sentence') || '').length;
  const noteLength: number = (item.getDataValue('note') || '').length;
  return sentenceLength + noteLength;
}
