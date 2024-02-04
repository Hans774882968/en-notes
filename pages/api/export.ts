import {
  CN_WORDS_MD,
  MERGED_MD_NAME,
  SENTENCES_MD,
  SEPARATE_FILES_ZIP_FOLDER,
  SEPARATE_FILES_ZIP_NAME,
  SYNONYMS_MD,
  WORDS_MD,
  WORD_SENTENCES_MD
} from '@/lib/const';
import { ExportParams } from '@/lib/backend/paramAndResp';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import {
  getMergedMdStr,
  getSeparateCnWordsMdStr,
  getSeparateSentencesMdStr,
  getSeparateSynonymsMdStr,
  getSeparateWordSentencesMdStr,
  getSeparateWordsMdStr
} from '@/db/db2Md';
import { validateReq } from '@/middlewares/validateReq';
import JSZip from 'jszip';

const router = createRouter<NextApiRequest, NextApiResponse>();

function setHeaders(res: NextApiResponse, fileName: string) {
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
}

router.get(
  validateReq<ExportParams>({
    schema: {
      additionalProperties: false,
      properties: {
        junctionTables: { nullable: true, type: 'string' },
        separate: { nullable: true, type: 'string' }
      },
      type: 'object'
    },
    validateQuery: true
  }),
  async(req, res) => {
    const { junctionTables: _junctionTables, separate: _separate } = req.query;
    const separate = Boolean(_separate);
    const junctionTables = Boolean(_junctionTables);

    if (!separate) {
      const mdContent = await getMergedMdStr(junctionTables);
      setHeaders(res, MERGED_MD_NAME);
      res.end(mdContent);
      return;
    }

    const zip = new JSZip();
    const rootFolder = zip.folder(SEPARATE_FILES_ZIP_FOLDER);
    const wordsMdStr = await getSeparateWordsMdStr();
    rootFolder?.file(WORDS_MD, wordsMdStr);
    const cnWordsMdStr = await getSeparateCnWordsMdStr();
    rootFolder?.file(CN_WORDS_MD, cnWordsMdStr);
    const sentencesMdStr = await getSeparateSentencesMdStr();
    rootFolder?.file(SENTENCES_MD, sentencesMdStr);
    if (junctionTables) {
      const wordSentencesMdStr = await getSeparateWordSentencesMdStr();
      rootFolder?.file(WORD_SENTENCES_MD, wordSentencesMdStr);
      const synonymsMdStr = await getSeparateSynonymsMdStr();
      rootFolder?.file(SYNONYMS_MD, synonymsMdStr);
    }
    setHeaders(res, SEPARATE_FILES_ZIP_NAME);
    zip.generateNodeStream({ streamFiles: true, type: 'nodebuffer' }).pipe(res);
  }
);

export default router.handler();
