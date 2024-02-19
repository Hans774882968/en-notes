import { GetWordListParams } from '@/lib/backend/paramAndResp';
import { NextApiRequest, NextApiResponse } from 'next';
import { Op } from 'sequelize';
import { Resp, suc } from '@/lib/resp';
import { createRouter } from 'next-connect';
import { removeFalsyAttrs } from '@/lib/utils';
import { sentence, word } from '@/db/models';
import { validateReq } from '@/middlewares/validateReq';

const router = createRouter<NextApiRequest, NextApiResponse<Resp>>();

// 因为是列表页接口，为了实现方便就先不支持子序列查询了
// distinct: true 给 sql 加上 COUNT(DISTINCT(col)) 可以解决 count 不对的问题
// TODO: use ES
router.post(
  validateReq<GetWordListParams> ({
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
    const queryRes = await word.findAndCountAll({
      distinct: true,
      include: [sentence, 'itsSynonyms'],
      limit: pageSize,
      offset: (pageNum - 1) * pageSize,
      where: {
        ...queryConditionObj
      }
    });
    res.status(200).json(suc({
      rows: queryRes.rows,
      total: queryRes.count
    }));
  }
);

export default router.handler();
