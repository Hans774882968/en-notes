import { NextApiRequest, NextApiResponse } from 'next';
import { SENTENCE_NOT_FOUND, UPDATE_SENTENCE_EXCEPTION } from '@/lib/retcode';
import { UpdateSentenceParams } from '@/lib/backend/paramAndResp';
import { createRouter } from 'next-connect';
import { fail, suc } from '@/lib/resp';
import { isAuthorized } from '@/middlewares/isAuthorized';
import { sentence } from '@/db/models';
import { sentenceIdValidatorSchema } from '@/lib/backend/paramValidators';
import { validateReq } from '@/middlewares/validateReq';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(
  validateReq<UpdateSentenceParams>({
    keywordObjects: [
      sentenceIdValidatorSchema
    ],
    schema: {
      additionalProperties: false,
      properties: {
        id: { sentenceIdLegal: null, type: ['number', 'string'] },
        note: { type: 'string' },
        sentence: { type: 'string' }
      },
      required: ['sentence', 'note', 'id'],
      type: 'object'
    }
  }),
  isAuthorized(),
  async(req, res) => {
    let { id, note, sentence: sentenceData } = req.body;
    id = id.toString().trim();
    sentenceData = sentenceData.trim();
    note = note.trim();
    try {
      const originalSentence = await sentence.findByPk(id);
      if (!originalSentence) {
        res.status(200).json(fail(SENTENCE_NOT_FOUND(id)));
        return;
      }
      const [affectedCount] = await sentence.update(
        {
          note,
          sentence: sentenceData
        },
        { where: { id } }
      );
      res.status(200).json(suc({
        affectedCount,
        sentence: {
          id,
          note,
          sentence: sentenceData
        }
      }));
    } catch (e) {
      res.status(500).json(fail(UPDATE_SENTENCE_EXCEPTION(e)));
    }
  }
);

export default router.handler();
