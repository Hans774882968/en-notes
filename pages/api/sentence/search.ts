import { NextApiRequest, NextApiResponse } from 'next';
import { SearchParams } from '@/lib/backend/paramAndResp';
import { createRouter } from 'next-connect';
import { isSubSequence } from '@/lib/backend/utils';
import { sentence } from '@/db/models';
import { suc } from '@/lib/resp';
import { validateReq } from '@/middlewares/validateReq';

const router = createRouter<NextApiRequest, NextApiResponse>();
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
      const someSentences = await sentence.findAll({
        limit: 50
      });
      res.status(200).json(suc({ result: someSentences }));
      return;
    }
    const allSentences = await sentence.findAll();
    const searchResult = allSentences.filter((st) => {
      return isSubSequence(st.getDataValue('sentence'), search as any);
    });
    res.status(200).json(suc({ result: searchResult }));
  }
);

export default router.handler();
