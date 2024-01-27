import { ADD_WORD_SYNONYM_EXCEPTION, WORD_NOT_FOUND } from '../../lib/retcode';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { enWordRegex } from '../../db/const';
import { fail, suc } from '../../lib/resp';
import { synonym, word } from '../../db/models';
import { validateReq } from '../../middlewares/validateReq';

const router = createRouter<NextApiRequest, NextApiResponse>();

interface AddWordSynonymParams {
  lhs: string
  rhs: string
}

router.post(
  validateReq<AddWordSynonymParams> ({
    keywordObjects: [
      {
        keyword: 'wordLegal',
        type: 'string',
        validate: (schema: Record<string, any>, wordData: string) => {
          return enWordRegex.test(wordData.trim());
        }
      }
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
  async(req, res) => {
    let { lhs, rhs } = req.body;
    lhs = lhs.trim().toLowerCase();
    rhs = rhs.trim().toLowerCase();

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
