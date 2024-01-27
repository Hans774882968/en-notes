import { NextApiRequest, NextApiResponse } from 'next';
import { UPSERT_WORD_EXCEPTION } from '../../lib/retcode';
import { createRouter } from 'next-connect';
import { enWordRegex } from '../../db/const';
import { upsertWordRecord } from '../../lib/apiUtils';
import { validateReq } from '../../middlewares/validateReq';
import { word } from '../../db/models';

const router = createRouter<NextApiRequest, NextApiResponse>();

interface UpsertWordParams {
  note: string
  word: string
}

router.post(
  validateReq<UpsertWordParams>({
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
        note: { type: 'string' },
        word: { type: 'string', wordLegal: null }
      },
      required: ['word', 'note'],
      type: 'object'
    }
  }),
  async(req, res) => {
    upsertWordRecord({
      model: word,
      req,
      res,
      toLowerCase: true,
      upsertExceptionCode: UPSERT_WORD_EXCEPTION
    });
  }
);

export default router.handler();
