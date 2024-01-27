import { NextApiRequest, NextApiResponse } from 'next';
import { Resp, suc } from '../../lib/resp';
import { cnWord } from '../../db/models';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequest, NextApiResponse<Resp>>();

router.get(async(req, res) => {
  res.status(200).json(suc({ words: await cnWord.findAll() }));
});

export default router.handler();
