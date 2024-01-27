import { Model, ModelStatic, Op, Sequelize } from 'sequelize';
import { NextApiRequest, NextApiResponse } from 'next';
import { RetMsg, fail, suc } from './resp';

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
        [Op.gt]: new Date(new Date() as any - 86400000)
      }
    }
  });
}
