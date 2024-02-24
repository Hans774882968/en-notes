import { GetWordListParams } from '@/lib/backend/paramAndResp';
import { NextApiRequest, NextApiResponse } from 'next';
import { Op } from 'sequelize';
import { Resp, suc } from '@/lib/resp';
import { calcWordComplexity } from '@/db/modelComplexity';
import { createRouter } from 'next-connect';
import { removeFalsyAttrs } from '@/lib/utils';
import { sentence, word } from '@/db/models';
import { validateReq } from '@/middlewares/validateReq';

const router = createRouter<NextApiRequest, NextApiResponse<Resp>>();

// 因为是列表页接口，为了实现方便就先不支持子序列查询了
// distinct: true 给 sql 加上 COUNT(DISTINCT(col)) 可以解决 count 不对的问题
// TODO: 按近义词个数和 complexity 搜索、排序。这个需求有两种做法：
// 1. 使用原生查询（sequelize.query），实现难度较高
// 2. 给 word 新增两个字段，实现难度较低但要写更多代码
// 已知：写多读少。列表页较少使用
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
    const rows = queryRes.rows.map((item) => {
      const complexity = calcWordComplexity(item);
      const itsSynonyms = item.getDataValue('itsSynonyms');
      const synonymCount = itsSynonyms.length;

      return {
        complexity,
        ctime: item.getDataValue('ctime'),
        itsSynonyms,
        mtime: item.getDataValue('mtime'),
        note: item.getDataValue('note'),
        sentences: item.getDataValue('sentences'),
        synonymCount,
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
