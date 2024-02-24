import { Model, ModelStatic, Op, literal } from 'sequelize';
import { NewTextWrittenResp } from '../../paramAndResp';
import { cnWord, sentence, word } from '@/db/models';
import { getDatesByInterval } from '@/lib/date';
import dayjs from 'dayjs';

/** 按 ctime 统计每天新写的文本数。
 * 1. 为了实现简单，有如下特性（我说不是 bug 就不是 bug ！）：
 * 日期 a 创建的单词字数 x ，在日期 b 修改后不错字数 y，那么这个单词对日期 a 的贡献是 y ，对日期 b 的贡献是 0
 * 2. 统计每天编辑的文本数这个需求点做不了
 * word: len(word) + len(note)
 * cnWord: len(word) + len(note)
 * sentence: len(sentence) + len(note)
*/
export async function getModelNewTextWrittenByDate(
  model: ModelStatic<Model>,
  newWrittenTotalSqlLiteral: string,
  startDate: Date,
  endDate: Date
) {
  const queryResult = await model.count({
    attributes: [
      [literal('DATE(ctime)'), 'date'],
      [literal(newWrittenTotalSqlLiteral), 'newWrittenTotal']
    ],
    group: ['date'],
    where: {
      ctime: {
        [Op.gte]: startDate,
        [Op.lt]: endDate
      }
    }
  });
  const mp = queryResult.reduce((mp, item) => {
    mp.set(item.date as string, parseInt(item.newWrittenTotal as string));
    return mp;
  }, new Map<string, number>());
  return mp;
}

export async function getNewTextWrittenByDate() {
  const now = new Date();
  const endDate = now;
  const startDate = dayjs(now).subtract(30, 'day').toDate();
  const wordMp = await getModelNewTextWrittenByDate(word, 'SUM(CHAR_LENGTH(word) + CHAR_LENGTH(note))', startDate, endDate);
  const cnWordMp = await getModelNewTextWrittenByDate(cnWord, 'SUM(CHAR_LENGTH(word) + CHAR_LENGTH(note))', startDate, endDate);
  const sentenceMp = await getModelNewTextWrittenByDate(sentence, 'SUM(CHAR_LENGTH(sentence) + CHAR_LENGTH(note))', startDate, endDate);
  const dates = getDatesByInterval(startDate, endDate);
  const res = dates.reduce<NewTextWrittenResp>(({
    wordNewWrittenTotals,
    cnWordNewWrittenTotals,
    sentenceNewWrittenTotals,
    ...rest
  }, date) => {
    wordNewWrittenTotals.push(wordMp.get(date) || 0);
    cnWordNewWrittenTotals.push(cnWordMp.get(date) || 0);
    sentenceNewWrittenTotals.push(sentenceMp.get(date) || 0);
    return {
      cnWordNewWrittenTotals, sentenceNewWrittenTotals, wordNewWrittenTotals, ...rest
    };
  }, { cnWordNewWrittenTotals: [], dates, sentenceNewWrittenTotals: [], wordNewWrittenTotals: [] });
  return res;
}
