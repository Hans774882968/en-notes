import { NextApiRequest, NextApiResponse } from 'next';
import { Resp, suc } from '@/lib/resp';
import { cnWord, sentence, word } from '@/db/models';
import { createRouter } from 'next-connect';
import { getCnWordComplexity } from '@/lib/backend/service/dashboard/getRecordComplexity';
import {
  getDashboardRecordResultItems,
  getSentenceComplexity,
  getSentenceCountOfWord,
  getSynonymCount,
  getThisMonthRecordCount,
  getWordComplexity,
  getWordCountOfSentence
} from '@/lib/backend/service/dashboard';

const router = createRouter<NextApiRequest, NextApiResponse<Resp>>();

router.get(async(req, res) => {
  const wordCtimeResult = await getThisMonthRecordCount(word, 'ctime');
  const cnWordCtimeResult = await getThisMonthRecordCount(cnWord, 'ctime');
  const sentenceCtimeResult = await getThisMonthRecordCount(sentence, 'ctime');
  const wordMtimeResult = await getThisMonthRecordCount(word, 'mtime');
  const cnWordMtimeResult = await getThisMonthRecordCount(cnWord, 'mtime');
  const sentenceMtimeResult = await getThisMonthRecordCount(sentence, 'mtime');
  const wordResultData = getDashboardRecordResultItems(wordCtimeResult.result, wordMtimeResult.result);
  const cnWordResultData = getDashboardRecordResultItems(cnWordCtimeResult.result, cnWordMtimeResult.result);
  const sentenceResultData = getDashboardRecordResultItems(sentenceCtimeResult.result, sentenceMtimeResult.result);

  const synonymCount = await getSynonymCount();

  const sentenceCountOfWord = await getSentenceCountOfWord();

  const wordCountOfSentence = await getWordCountOfSentence();

  const wordComplexity = await getWordComplexity();
  const sentenceComplexity = await getSentenceComplexity();
  const cnWordComplexity = await getCnWordComplexity();

  res.status(200).json(suc({
    cnWordComplexity,
    recordCount: {
      cnWord: {
        data: cnWordResultData,
        learn: cnWordCtimeResult.total,
        learnOrReview: cnWordMtimeResult.total
      },
      sentence: {
        data: sentenceResultData,
        learn: sentenceCtimeResult.total,
        learnOrReview: sentenceMtimeResult.total
      },
      word: {
        data: wordResultData,
        learn: wordCtimeResult.total,
        learnOrReview: wordMtimeResult.total
      }
    },
    sentenceComplexity,
    sentenceCountOfWord,
    synonymCount,
    wordComplexity,
    wordCountOfSentence
  }));
});

export default router.handler();
