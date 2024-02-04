import { NextApiRequest, NextApiResponse } from 'next';
import { UPSERT_CN_WORD_EXCEPTION } from '@/lib/retcode';
import { UpsertCnWordParams } from '@/lib/backend/paramAndResp';
import { cnWord } from '@/db/models';
import { createRouter } from 'next-connect';
import { upsertWordRecord } from '@/lib/backend/apiUtils';
import { validateReq } from '@/middlewares/validateReq';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(
  validateReq<UpsertCnWordParams>({
    keywordObjects: [
      {
        keyword: 'wordLegal',
        type: 'string',
        validate: (schema: Record<string, any>, wordData: string) => {
          return !wordData.trim().includes('\n');
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
      model: cnWord,
      req,
      res,
      upsertExceptionCode: UPSERT_CN_WORD_EXCEPTION
    });
  }
);

export default router.handler();
