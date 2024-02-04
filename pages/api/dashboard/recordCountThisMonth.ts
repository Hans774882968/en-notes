import { NextApiRequest, NextApiResponse } from 'next';
import { Resp, suc } from '@/lib/resp';
import { cnWord, sentence, word } from '@/db/models';
import { createRouter } from 'next-connect';
import { getThisMonthRecordCount } from '@/lib/backend/apiUtils';

const router = createRouter<NextApiRequest, NextApiResponse<Resp>>();

router.get(async(req, res) => {
  const wordResult = await getThisMonthRecordCount(word);
  const cnWordResult = await getThisMonthRecordCount(cnWord);
  const sentenceResult = await getThisMonthRecordCount(sentence);
  res.status(200).json(suc({
    cnWord: cnWordResult,
    sentence: sentenceResult,
    word: wordResult
  }));
});

export default router.handler();
