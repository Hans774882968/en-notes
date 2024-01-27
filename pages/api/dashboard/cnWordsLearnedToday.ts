import { NextApiRequest, NextApiResponse } from 'next';
import { Resp, suc } from '@/lib/resp';
import { cnWord } from '@/db/models';
import { createRouter } from 'next-connect';
import { getTodayRecords } from '@/lib/apiUtils';

const router = createRouter<NextApiRequest, NextApiResponse<Resp>>();

router.get(async(req, res) => {
  const cnWords = await getTodayRecords(cnWord);
  res.status(200).json(suc({ words: cnWords }));
});

export default router.handler();
