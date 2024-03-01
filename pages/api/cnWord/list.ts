import { GetCnWordListParams } from '@/lib/backend/paramAndResp';
import { NextApiRequest, NextApiResponse } from 'next';
import { Op } from 'sequelize';
import { Resp, suc } from '@/lib/resp';
import { calcCnWordComplexity } from '@/db/modelComplexity';
import { cnWord } from '@/db/models';
import { createRouter } from 'next-connect';
import { removeFalsyAttrs } from '@/lib/utils';
import { validateReq } from '@/middlewares/validateReq';

const router = createRouter<NextApiRequest, NextApiResponse<Resp>>();

router.post(
  validateReq<GetCnWordListParams> ({
    schema: {
      additionalProperties: false,
      properties: {
        ctime: { items: { type: 'string' }, maxItems: 2, minItems: 2, nullable: true, type: 'array' },
        mtime: { items: { type: 'string' }, maxItems: 2, minItems: 2, nullable: true, type: 'array' },
        note: { nullable: true, type: 'string' },
        pageNum: { type: 'number' },
        pageSize: { type: 'number' },
        word: { nullable: true, type: 'string' }
      },
      required: ['pageNum', 'pageSize'],
      type: 'object'
    }
  }),
  async(req, res) => {
    const {
      ctime,
      mtime,
      note,
      pageNum,
      pageSize,
      word: wordKey
    } = req.body;
    const queryConditionObj = removeFalsyAttrs({
      ctime: ctime ? {
        [Op.between]: ctime.map((item: string) => new Date(item))
      } : null,
      mtime: mtime ? {
        [Op.between]: mtime.map((item: string) => new Date(item))
      } : null,
      note: note ? {
        [Op.substring]: note
      } : null,
      word: wordKey ? {
        [Op.substring]: wordKey
      } : null
    });
    const queryRes = await cnWord.findAndCountAll({
      distinct: true,
      limit: pageSize,
      offset: (pageNum - 1) * pageSize,
      where: {
        ...queryConditionObj
      }
    });
    const rows = queryRes.rows.map((item) => {
      const complexity = calcCnWordComplexity(item);

      return {
        complexity,
        ctime: item.getDataValue('ctime'),
        mtime: item.getDataValue('mtime'),
        note: item.getDataValue('note'),
        sentences: item.getDataValue('sentences'),
        word: item.getDataValue('word')
      };
    });
    res.status(200).json(suc({
      rows,
      total: queryRes.count
    }));
  }
);

export default router.handler();
