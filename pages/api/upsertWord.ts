import { NextApiRequest, NextApiResponse } from 'next';
import { UPSERT_WORD_EXCEPTION } from '@/lib/retcode';
import { UpsertWordParams } from '@/lib/backend/paramAndResp';
import { createRouter } from 'next-connect';
import { enWordValidatorSchema } from '@/lib/backend/paramValidators';
import { isAuthorized } from '@/middlewares/isAuthorized';
import { upsertWordRecord } from '@/lib/backend/apiUtils';
import { validateReq } from '@/middlewares/validateReq';
import { word } from '@/db/models';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(
  validateReq<UpsertWordParams>({
    keywordObjects: [
      enWordValidatorSchema
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
  isAuthorized(),
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
