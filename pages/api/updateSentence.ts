import { NextApiRequest, NextApiResponse } from 'next';
import { SENTENCE_NOT_FOUND, UPDATE_SENTENCE_EXCEPTION } from '../../lib/retcode';
import { createRouter } from 'next-connect';
import { fail, suc } from '../../lib/resp';
import { sentence } from '../../db/models';
import { validateReq } from '../../middlewares/validateReq';

const router = createRouter<NextApiRequest, NextApiResponse>();

interface UpdateSentenceParams {
  id: string
  note: string
  sentence: string
}

router.post(
  validateReq<UpdateSentenceParams>({
    schema: {
      additionalProperties: false,
      properties: {
        id: { type: 'string' },
        note: { type: 'string' },
        sentence: { type: 'string' }
      },
      required: ['sentence', 'note', 'id'],
      type: 'object'
    }
  }),
  async(req, res) => {
    let { id, note, sentence: sentenceData } = req.body;
    id = id.trim();
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
        { where: { id }}
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