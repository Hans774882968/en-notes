import { DashboardRecordResultItem, modelCountThisMonth } from '@/lib/backend/paramAndResp';
import { Model, ModelStatic, Op, literal } from 'sequelize';
import { NextApiRequest, NextApiResponse } from 'next';
import { Resp, suc } from '@/lib/resp';
import { cnWord, sentence, word } from '@/db/models';
import { createRouter } from 'next-connect';
import dayjs from 'dayjs';

const fieldMap = {
  ctime: 'DATE(ctime)',
  mtime: 'DATE(mtime)'
};

async function getThisMonthRecordCount(
  model: ModelStatic<Model>,
  fieldKey: keyof typeof fieldMap
): Promise<modelCountThisMonth> {
  const now = new Date();
  const startDate = dayjs(now).subtract(30, 'day').toDate();
  const queryResult = await model.count({
    attributes: [
      [literal(fieldMap[fieldKey]), 'date'],
      [literal('COUNT(*)'), 'count']
    ],
    group: ['date'],
    where: {
      [fieldKey]: {
        [Op.gte]: startDate,
        [Op.lt]: now
      }
    }
  });
  const total = queryResult.reduce((tot, item) => tot + item.count, 0);
  const mp = queryResult.reduce((mp, item) => {
    mp.set(item.date as string, item.count);
    return mp;
  }, new Map<string, number>());
  return {
    result: mp,
    total
  };
}

function getDashboardRecordResultItems(
  ctimeResultMap: modelCountThisMonth['result'],
  mtimeResultMap: modelCountThisMonth['result']
) {
  const mergedMap = new Map<string, {learn: number, learnOrReview: number}>();
  ctimeResultMap.forEach((v, k) => {
    const learnOrReview = mtimeResultMap.get(k) || 0;
    mergedMap.set(k, { learn: v, learnOrReview });
  });
  mtimeResultMap.forEach((v, k) => {
    const learn = ctimeResultMap.get(k) || 0;
    mergedMap.set(k, { learn, learnOrReview: v });
  });
  const res: DashboardRecordResultItem[] = [];
  mergedMap.forEach((v, k) => res.push({ date: k, ...v }));
  res.sort((x, y) => x.date === y.date ? 0 : (new Date(x.date) > new Date(y.date) ? 1 : -1));
  return res;
}

/** TODO: 能否去掉子查询，从而不写业务代码
SELECT `count` AS `name`, COUNT(*) AS `value` FROM (
  SELECT `word`.`word`, COUNT(*) AS `count` FROM word INNER JOIN (synonym AS `itsSynonyms->synonym` INNER JOIN word AS itsSynonyms ON `itsSynonyms`.`word` = `itsSynonyms->synonym`.`rhs`) ON `word`.`word` = `itsSynonyms->synonym`.`lhs` GROUP BY word
) AS tmp GROUP BY tmp.count
 */
async function getSynonymCount() {
  const synonymRes = await word.count({
    attributes: [
      'word',
      [literal('COUNT(*)'), 'count']
    ],
    group: 'word',
    include: [{ association: 'itsSynonyms', required: true }]
  });
  const wordTotal = await word.count();
  const noSynonymWordCount = wordTotal - synonymRes.length;
  const mp = synonymRes.reduce((mp, { count }) => {
    const v = mp.get(count) || 0;
    mp.set(count, v + 1);
    return mp;
  }, new Map<number, number>([[0, noSynonymWordCount]]));
  const res = Array.from(mp.entries()).map(([k, value]) => ({ name: String(k), value }));
  return res;
}

async function getSentenceCountOfWord() {
  const sentenceRes = await word.count({
    attributes: [
      'word',
      [literal('COUNT(*)'), 'count']
    ],
    group: 'word',
    include: [{ model: sentence, required: true }]
  });
  const wordTotal = await word.count();
  const noSentenceWordCount = wordTotal - sentenceRes.length;
  const mp = sentenceRes.reduce((mp, { count }) => {
    const v = mp.get(count) || 0;
    mp.set(count, v + 1);
    return mp;
  }, new Map<number, number>([[0, noSentenceWordCount]]));
  const res = Array.from(mp.entries()).map(([k, value]) => ({ name: String(k), value }));
  return res;
}

const router = createRouter<NextApiRequest, NextApiResponse<Resp>>();

router.get(async(req, res) => {
  const wordCtimeResult = await getThisMonthRecordCount(word, 'ctime');
  const cnWordCtimeResult = await getThisMonthRecordCount(cnWord, 'ctime');
  const sentenceCtimeResult = await getThisMonthRecordCount(sentence, 'ctime');
  const wordMtimeResult = await getThisMonthRecordCount(word, 'mtime');
  const cnWordMtimeResult = await getThisMonthRecordCount(cnWord, 'mtime');
  const sentenceMtimeResult = await getThisMonthRecordCount(sentence, 'mtime');
  const wordResultData = getDashboardRecordResultItems(wordCtimeResult.result, wordMtimeResult.result);
  const cnWordResultData = getDashboardRecordResultItems(cnWordCtimeResult.result, cnWordMtimeResult.result);
  const sentenceResultData = getDashboardRecordResultItems(sentenceCtimeResult.result, sentenceMtimeResult.result);

  const synonymCount = await getSynonymCount();

  const sentenceCountOfWord = await getSentenceCountOfWord();

  res.status(200).json(suc({
    recordCount: {
      cnWord: {
        data: cnWordResultData,
        learn: cnWordCtimeResult.total,
        learnOrReview: cnWordMtimeResult.total
      },
      sentence: {
        data: sentenceResultData,
        learn: sentenceCtimeResult.total,
        learnOrReview: sentenceMtimeResult.total
      },
      word: {
        data: wordResultData,
        learn: wordCtimeResult.total,
        learnOrReview: wordMtimeResult.total
      }
    },
    sentenceCountOfWord,
    synonymCount
  }));
});

export default router.handler();
