import { CREATE_SENTENCE_EXCEPTION } from '@/lib/retcode';
import { CreateSentenceParams } from '@/lib/backend/paramAndResp';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { fail, suc } from '@/lib/resp';
import { isAuthorized } from '@/middlewares/isAuthorized';
import { sentence } from '@/db/models';
import { validateReq } from '@/middlewares/validateReq';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(
  validateReq<CreateSentenceParams>({
    schema: {
      additionalProperties: false,
      properties: {
        note: { type: 'string' },
        sentence: { type: 'string' }
      },
      required: ['sentence', 'note'],
      type: 'object'
    }
  }),
  isAuthorized(),
  async(req, res) => {
    let { note, sentence: sentenceData } = req.body;
    sentenceData = sentenceData.trim();
    note = note.trim();
    try {
      const createdRecord = await sentence.create({
        note,
        sentence: sentenceData
      });
      res.status(200).json(suc({ sentence: createdRecord }));
    } catch (e) {
      res.status(500).json(fail(CREATE_SENTENCE_EXCEPTION(e)));
    }
  }
);

export default router.handler();
