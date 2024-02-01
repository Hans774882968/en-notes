import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { isSubSequence } from '@/lib/backend/utils';
import { suc } from '@/lib/resp';
import { validateReq } from '@/middlewares/validateReq';
import { word } from '@/db/models';

const router = createRouter<NextApiRequest, NextApiResponse>();

interface SearchParams {
  search: string
}

// TODO: use ES
router.get(
  validateReq<SearchParams>({
    schema: {
      additionalProperties: false,
      properties: {
        search: { type: 'string' }
      },
      required: ['search'],
      type: 'object'
    },
    validateQuery: true
  }),
  async(req, res) => {
    const { search } = req.query;
    if (!search) {
      const someWords = await word.findAll({
        limit: 50
      });
      res.status(200).json(suc({ result: someWords }));
      return;
    }
    const allWords = await word.findAll();
    const searchResult = allWords.filter((wd) => {
      return isSubSequence(wd.getDataValue('word'), search as any);
    });
    res.status(200).json(suc({ result: searchResult }));
  }
);

export default router.handler();
