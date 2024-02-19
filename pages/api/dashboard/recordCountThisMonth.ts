import { DashboardRecordResultItem, DashboardResp, modelCountThisMonth } from '@/lib/backend/paramAndResp';
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

  res.status(200).json(suc({
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
  }));
});

export default router.handler();
