import { NextApiRequest, NextApiResponse } from 'next';
import { Resp, suc } from '@/lib/resp';
import { createRouter } from 'next-connect';
import { sentence, word } from '@/db/models';

const router = createRouter<NextApiRequest, NextApiResponse<Resp>>();

router.get(async(req, res) => {
  const { sentence: sentenceKey } = req.query;
  const resultSentence = await sentence.findByPk(sentenceKey as any, { include: [word] });
  res.status(200).json(suc({ sentence: resultSentence }));
});

export default router.handler();
