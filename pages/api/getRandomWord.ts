import { NextApiRequest, NextApiResponse } from 'next';
import { Resp, suc } from '../../lib/resp';
import { createRouter } from 'next-connect';
import { randomRecord } from '../../lib/apiUtils';
import { sentence, word } from '../../db/models';

const router = createRouter<NextApiRequest, NextApiResponse<Resp>>();

router.get(async(req, res) => {
  const resultWords = await randomRecord(req, word, { include: [sentence, 'itsSynonyms'] });
  res.status(200).json(suc({ words: resultWords }));
});

export default router.handler();
