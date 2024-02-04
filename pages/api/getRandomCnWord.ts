import { NextApiRequest, NextApiResponse } from 'next';
import { Resp, suc } from '@/lib/resp';
import { cnWord } from '@/db/models';
import { createRouter } from 'next-connect';
import { randomRecord } from '@/lib/backend/apiUtils';

const router = createRouter<NextApiRequest, NextApiResponse<Resp>>();

router.get(async(req, res) => {
  const resultCnWords = await randomRecord(req, cnWord);
  res.status(200).json(suc({ words: resultCnWords }));
});

export default router.handler();
