import { Model, ModelStatic, Op, Sequelize, col, fn, literal } from 'sequelize';
import { NextApiRequest, NextApiResponse } from 'next';
import { RetMsg, fail, suc } from '../resp';
import { modelCountThisMonth } from './paramAndResp';
import dayjs from 'dayjs';

export async function randomRecord(
  req: NextApiRequest,
  model: ModelStatic<Model>,
  findAllOptions: Record<string, any> = {}
) {
  let count = Math.max(parseInt(req.query?.count as any) || 1, 1);
  const result = await model.findAll({
    limit: count,
    order: [
      Sequelize.literal('rand()')
    ],
    ...findAllOptions
  });
  return result;
}

export async function upsertWordRecord({
  req,
  res,
  model,
  upsertExceptionCode,
  toLowerCase
}: {
  req: NextApiRequest
  res: NextApiResponse
  model: ModelStatic<Model>
  upsertExceptionCode: (e: unknown) => RetMsg
  toLowerCase?: boolean
}) {
  let { note, word: wordKey } = req.body;
  wordKey = wordKey.trim();
  if (toLowerCase) {
    wordKey = wordKey.toLowerCase();
  }
  note = note.trim();
  try {
    const [modifiedRecord, created] = await model.upsert({
      note,
      word: wordKey
    });
    res.status(200).json(suc({ created, word: modifiedRecord }));
  } catch (e) {
    res.status(500).json(fail(upsertExceptionCode(e)));
  }
}

export function getTodayRecords(model: ModelStatic<Model>) {
  return model.findAll({
    where: {
      ctime: {
        [Op.gte]: new Date(new Date() as any - 86400000)
      }
    }
  });
}

export async function getThisMonthRecordCount(model: ModelStatic<Model>): Promise<modelCountThisMonth> {
  const now = new Date();
  const startDate = dayjs(now).subtract(30, 'day').toDate();
  const queryResult = await model.count({
    attributes: [
      [literal('DATE(ctime)'), 'date'],
      [literal('COUNT(*)'), 'count']
    ],
    group: ['date'],
    where: {
      ctime: {
        [Op.gte]: startDate,
        [Op.lt]: now
      }
    }
  });
  const total = queryResult.reduce((tot, item) => tot + item.count, 0);
  return {
    result: queryResult,
    total
  };
}
