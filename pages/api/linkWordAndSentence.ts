import { LINK_WORD_SENTENCE_EXCEPTION, SENTENCE_NOT_FOUND, WORD_NOT_FOUND } from '@/lib/retcode';
import { LinkWordAndSentenceParams } from '@/lib/backend/paramAndResp';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { enWordRegex } from '@/db/const';
import { fail, suc } from '@/lib/resp';
import { isLegalSentenceId } from '@/db/models/sentence';
import { sentence, word, wordSentence } from '@/db/models';
import { validateReq } from '@/middlewares/validateReq';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(
  validateReq<LinkWordAndSentenceParams>({
    keywordObjects: [
      {
        keyword: 'wordLegal',
        type: 'string',
        validate: (schema: Record<string, any>, wordData: string) => {
          return enWordRegex.test(wordData.trim());
        }
      },
      {
        keyword: 'sentenceIdLegal',
        type: 'string',
        validate: (schema: Record<string, any>, sentenceIdData: string) => {
          return isLegalSentenceId(sentenceIdData.trim());
        }
      }
    ],
    schema: {
      additionalProperties: false,
      properties: {
        sentenceId: { sentenceIdLegal: null, type: 'string' },
        word: { type: 'string', wordLegal: null }
      },
      required: ['word', 'sentenceId'],
      type: 'object'
    }
  }),
  async(req, res) => {
    let { sentenceId, word: wordData } = req.body;
    sentenceId = sentenceId.trim();
    wordData = wordData.trim().toLowerCase();

    const wordRecord = await word.findByPk(wordData);
    if (!wordRecord) {
      res.status(200).json(fail(WORD_NOT_FOUND(wordData)));
      return;
    }

    const sentenceRecord = await sentence.findByPk(sentenceId);
    if (!sentenceRecord) {
      res.status(200).json(fail(SENTENCE_NOT_FOUND(sentenceId)));
      return;
    }

    try {
      const [, created] = await wordSentence.upsert({
        sentenceId,
        wordWord: wordData
      });
      res.status(200).json(suc({ created, sentenceId, word: wordData }));
    } catch (e) {
      res.status(500).json(fail(LINK_WORD_SENTENCE_EXCEPTION(e)));
    }
  }
);

export default router.handler();
