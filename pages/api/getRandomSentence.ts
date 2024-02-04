import { NextApiRequest, NextApiResponse } from 'next';
import { Resp, suc } from '@/lib/resp';
import { createRouter } from 'next-connect';
import { randomRecord } from '@/lib/backend/apiUtils';
import { sentence, word } from '@/db/models';

const router = createRouter<NextApiRequest, NextApiResponse<Resp>>();

router.get(async(req, res) => {
  const resultSentences = await randomRecord(req, sentence, { include: word });
  res.status(200).json(suc({ sentences: resultSentences }));
});

export default router.handler();
