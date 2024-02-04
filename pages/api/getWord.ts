import { NextApiRequest, NextApiResponse } from 'next';
import { Resp, suc } from '@/lib/resp';
import { createRouter } from 'next-connect';
import { sentence, word } from '@/db/models';

const router = createRouter<NextApiRequest, NextApiResponse<Resp>>();

router.get(async(req, res) => {
  const { word: wordKey } = req.query;
  const resultWord = await word.findByPk(wordKey as any, { include: [sentence, 'itsSynonyms'] });
  res.status(200).json(suc({ word: resultWord }));
});

export default router.handler();
