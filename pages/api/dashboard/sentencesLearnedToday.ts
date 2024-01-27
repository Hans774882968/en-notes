import { NextApiRequest, NextApiResponse } from 'next';
import { Resp } from '@/lib/resp';
import { createRouter } from 'next-connect';
import { getTodayRecords } from '@/lib/apiUtils';
import { sentence } from '@/db/models';
import { suc } from '@/lib/resp';

const router = createRouter<NextApiRequest, NextApiResponse<Resp>>();

router.get(async(req, res) => {
  const sentences = await getTodayRecords(sentence);
  res.status(200).json(suc({ sentences }));
});

export default router.handler();
