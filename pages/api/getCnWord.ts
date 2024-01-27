import { NextApiRequest, NextApiResponse } from 'next';
import { Resp, suc } from '../../lib/resp';
import { cnWord } from '../../db/models';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequest, NextApiResponse<Resp>>();

router.get(async(req, res) => {
  const { word: wordKey } = req.query;
  const resultWord = await cnWord.findByPk(wordKey as any);
  res.status(200).json(suc({ word: resultWord }));
});

export default router.handler();
