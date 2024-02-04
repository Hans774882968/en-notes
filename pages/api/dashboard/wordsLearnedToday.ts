import { NextApiRequest, NextApiResponse } from 'next';
import { Resp, suc } from '@/lib/resp';
import { createRouter } from 'next-connect';
import { getTodayRecords } from '@/lib/backend/apiUtils';
import { word } from '@/db/models';

const router = createRouter<NextApiRequest, NextApiResponse<Resp>>();

router.get(async(req, res) => {
  const words = await getTodayRecords(word);
  res.status(200).json(suc({ words }));
});

export default router.handler();
