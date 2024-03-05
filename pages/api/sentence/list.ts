import { GetSentenceListParams } from '@/lib/backend/paramAndResp';
import { NextApiRequest, NextApiResponse } from 'next';
import { Op } from 'sequelize';
import { Resp, suc } from '@/lib/resp';
import { calcSentenceComplexity } from '@/db/modelComplexity';
import { createRouter } from 'next-connect';
import { removeFalsyAttrs } from '@/lib/utils';
import { sentence, word } from '@/db/models';
import { sentenceIdValidatorSchema } from '@/lib/backend/paramValidators';
import { validateReq } from '@/middlewares/validateReq';

const router = createRouter<NextApiRequest, NextApiResponse<Resp>>();

router.post(
  validateReq<GetSentenceListParams> ({
    keywordObjects: [
      sentenceIdValidatorSchema
    ],
    schema: {
      additionalProperties: false,
      properties: {
        ctime: { items: { type: 'string' }, maxItems: 2, minItems: 2, nullable: true, type: 'array' },
        id: { nullable: true, sentenceIdLegal: null, type: ['number', 'string'] },
        mtime: { items: { type: 'string' }, maxItems: 2, minItems: 2, nullable: true, type: 'array' },
        note: { nullable: true, type: 'string' },
        pageNum: { type: 'number' },
        pageSize: { type: 'number' },
        sentence: { nullable: true, type: 'string' }
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
      id: sentenceId,
      sentence: sentenceText
    } = req.body;
    const queryConditionObj = removeFalsyAttrs({
      ctime: ctime ? {
        [Op.between]: ctime.map((item: string) => new Date(item))
      } : null,
      id: sentenceId ? sentenceId : null,
      mtime: mtime ? {
        [Op.between]: mtime.map((item: string) => new Date(item))
      } : null,
      note: note ? {
        [Op.substring]: note
      } : null,
      sentence: sentenceText ? {
        [Op.substring]: sentenceText
      } : null
    });
    const queryRes = await sentence.findAndCountAll({
      distinct: true,
      include: [word],
      limit: pageSize,
      offset: (pageNum - 1) * pageSize,
      where: {
        ...queryConditionObj
      }
    });
    const rows = queryRes.rows.map((item) => {
      const complexity = calcSentenceComplexity(item);

      return {
        complexity,
        ctime: item.getDataValue('ctime'),
        id: item.getDataValue('id'),
        mtime: item.getDataValue('mtime'),
        note: item.getDataValue('note'),
        sentence: item.getDataValue('sentence'),
        words: item.getDataValue('words')
      };
    });
    res.status(200).json(suc({
      rows,
      total: queryRes.count
    }));
  }
);

export default router.handler();
