import {
  CN_WORDS_MD,
  MERGED_MD_NAME,
  SENTENCES_MD,
  SYNONYMS_MD,
  WORDS_MD,
  WORD_SENTENCES_MD
} from '@/lib/const';
import {
  getMergedMdStr,
  getSeparateCnWordsMdStr,
  getSeparateSentencesMdStr,
  getSeparateSynonymsMdStr,
  getSeparateWordSentencesMdStr,
  getSeparateWordsMdStr
} from '../db2Md';
import fs from 'fs';
import path from 'path';

const appDirectory = fs.realpathSync(process.cwd());

function genSeparateMds(junctionTables: boolean) {
  async function genWordsMd() {
    const wordsMdStr = await getSeparateWordsMdStr();
    const wordsMdPath = path.resolve(appDirectory, WORDS_MD);
    fs.writeFileSync(wordsMdPath, wordsMdStr);
  }

  async function genCnWordsMd() {
    const cnWordsMdStr = await getSeparateCnWordsMdStr();
    const cnWordsMdPath = path.resolve(appDirectory, CN_WORDS_MD);
    fs.writeFileSync(cnWordsMdPath, cnWordsMdStr);
  }

  async function genSentencesMd() {
    const sentencesMdStr = await getSeparateSentencesMdStr();
    const sentencesMdPath = path.resolve(appDirectory, SENTENCES_MD);
    fs.writeFileSync(sentencesMdPath, sentencesMdStr);
  }

  async function genWordSentencesMd() {
    const wordSentencesMdStr = await getSeparateWordSentencesMdStr();
    const wordSentencesMdPath = path.resolve(appDirectory, WORD_SENTENCES_MD);
    fs.writeFileSync(wordSentencesMdPath, wordSentencesMdStr);
  }

  async function genSynonymsMd() {
    const synonymsMdStr = await getSeparateSynonymsMdStr();
    const synonymsMdPath = path.resolve(appDirectory, SYNONYMS_MD);
    fs.writeFileSync(synonymsMdPath, synonymsMdStr);
  }

  genWordsMd();
  genCnWordsMd();
  genSentencesMd();
  if (junctionTables) {
    genWordSentencesMd();
    genSynonymsMd();
  }
}

async function genMergedMd(junctionTables: boolean) {
  const mdStr = await getMergedMdStr(junctionTables);
  const mergedMdPath = path.resolve(appDirectory, MERGED_MD_NAME);
  fs.writeFileSync(mergedMdPath, mdStr);
}

function main() {
  const junctionTables = true;
  if (process.argv[0] === 'separate') {
    genSeparateMds(junctionTables);
    return;
  }
  genMergedMd(junctionTables);
}

main();
