import { NextApiRequest, NextApiResponse } from 'next';
import { Resp, suc } from '@/lib/resp';
import { createRouter } from 'next-connect';
import { word } from '@/db/models';

const router = createRouter<NextApiRequest, NextApiResponse<Resp>>();

router.get(async(req, res) => {
  res.status(200).json(suc({ words: await word.findAll() }));
});

export default router.handler();
