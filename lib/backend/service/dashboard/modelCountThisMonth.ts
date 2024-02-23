import { DashboardRecordResultItem, modelCountThisMonth } from '@/lib/backend/paramAndResp';
import { Model, ModelStatic, Op, literal } from 'sequelize';
import dayjs from 'dayjs';

const fieldMap = {
  ctime: 'DATE(ctime)',
  mtime: 'DATE(mtime)'
};

export async function getThisMonthRecordCount(
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

export function getDashboardRecordResultItems(
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
