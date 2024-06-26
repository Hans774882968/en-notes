import { ADD_WORD_SYNONYM_EXCEPTION, LHS_RHS_SHOULD_NOT_EQUAL, WORD_NOT_FOUND } from '@/lib/retcode';
import { AddWordSynonymParams } from '@/lib/backend/paramAndResp';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { enWordValidatorSchema } from '@/lib/backend/paramValidators';
import { fail, suc } from '@/lib/resp';
import { isAuthorized } from '@/middlewares/isAuthorized';
import { synonym, word } from '@/db/models';
import { validateReq } from '@/middlewares/validateReq';

const router = createRouter<NextApiRequest, NextApiResponse>();

// TODO: 有一个bug：假设有两个连通块 1-2 3-4 ，请求是1连3，那么目前的代码连接了1-3,4和3-1,2，漏了2-4
router.post(
  validateReq<AddWordSynonymParams> ({
    keywordObjects: [
      enWordValidatorSchema
    ],
    schema: {
      additionalProperties: false,
      properties: {
        lhs: { type: 'string', wordLegal: null },
        rhs: { type: 'string', wordLegal: null }
      },
      required: ['lhs', 'rhs'],
      type: 'object'
    }
  }),
  isAuthorized(),
  async(req, res) => {
    let { lhs, rhs } = req.body;
    lhs = lhs.trim().toLowerCase();
    rhs = rhs.trim().toLowerCase();

    if (lhs === rhs) {
      res.status(200).json(fail(LHS_RHS_SHOULD_NOT_EQUAL(lhs)));
      return;
    }

    const lhsRecord = await word.findByPk(lhs);
    if (!lhsRecord) {
      res.status(200).json(fail(WORD_NOT_FOUND(lhs)));
      return;
    }

    const rhsRecord = await word.findByPk(rhs);
    if (!rhsRecord) {
      res.status(200).json(fail(WORD_NOT_FOUND(rhs)));
      return;
    }

    try {
      let created: boolean | null = false;

      await Promise.all([
        Promise.all([lhsRecord, ...await (lhsRecord as any).getItsSynonyms()].map(async(lhsSynonym) => {
          const lhsSynonymPk = lhsSynonym.getDataValue('word');
          if (lhsSynonymPk === rhs) return;
          const [, created1] = await synonym.upsert({
            lhs: lhsSynonymPk,
            rhs
          });
          const [, created2] = await synonym.upsert({
            lhs: rhs,
            rhs: lhsSynonymPk
          });
          created = created || created1 || created2;
        })),
        Promise.all([rhsRecord, ...await (rhsRecord as any).getItsSynonyms()].map(async(rhsSynonym) => {
          const rhsSynonymPk = rhsSynonym.getDataValue('word');
          if (rhsSynonymPk === lhs) return;
          const [, created1] = await synonym.upsert({
            lhs,
            rhs: rhsSynonymPk
          });
          const [, created2] = await synonym.upsert({
            lhs: rhsSynonymPk,
            rhs: lhs
          });
          created = created || created1 || created2;
        }))
      ]);

      res.status(200).json(suc({ created, lhs: lhsRecord, rhs: rhsRecord }));
    } catch (e) {
      res.status(500).json(fail(ADD_WORD_SYNONYM_EXCEPTION(e)));
    }
  }
);

export default router.handler();
