import { Model } from 'sequelize';
import {
  cnWord,
  sentence,
  synonym,
  word,
  wordSentence
} from './models';

export function getWordsMdContent(words: Model[], head = '') {
  return words.reduce((mdStr, wd) => {
    const noteStr = wd.getDataValue('note');
    const wordStr = wd.getDataValue('word');
    const cur = `## ${wordStr}\n\n${noteStr}\n\n`;
    return mdStr + cur;
  }, head);
}

export function getCnWordsMdContent(cnWords: Model[], head = '') {
  return cnWords.reduce((mdStr, wd) => {
    const noteStr = wd.getDataValue('note');
    const wordStr = wd.getDataValue('word');
    const cur = `## ${wordStr}\n\n${noteStr}\n\n`;
    return mdStr + cur;
  }, head);
}

export function getSentencesMdContent(sentences: Model[], head = '') {
  return sentences.reduce((mdStr, wd) => {
    const noteStr = wd.getDataValue('note');
    const sentenceStr = wd.getDataValue('sentence');
    const cur = `## ${sentenceStr}\n\n${noteStr}\n\n`;
    return mdStr + cur;
  }, head);
}

export function getWordSentencesMdContent(wordSentences: Model[], head = '') {
  return wordSentences.reduce((mdStr, ws) => {
    const sid = ws.getDataValue('sentenceId');
    const wordStr = ws.getDataValue('wordWord');
    const cur = `${sid}|${wordStr}\n`;
    return mdStr + cur;
  }, head) + '\n';
}

export function getSynonymsMdContent(synonyms: Model[], head = '') {
  return synonyms.reduce((mdStr, sy) => {
    const lhs = sy.getDataValue('lhs');
    const rhs = sy.getDataValue('rhs');
    const cur = `${lhs}。${rhs}\n`;
    return mdStr + cur;
  }, head) + '\n';
}

export async function getSeparateWordsMdStr() {
  const words = await word.findAll();
  const wordsMdStr = getWordsMdContent(words, '[toc]\n\n').trim();
  return wordsMdStr;
}

export async function getSeparateCnWordsMdStr() {
  const cnWords = await cnWord.findAll();
  const cnWordsMdStr = getCnWordsMdContent(cnWords, '[toc]\n\n').trim();
  return cnWordsMdStr;
}

export async function getSeparateSentencesMdStr() {
  const sentences = await sentence.findAll();
  const sentencesMdStr = getSentencesMdContent(sentences, '[toc]\n\n').trim();
  return sentencesMdStr;
}

export async function getSeparateWordSentencesMdStr() {
  const wordSentences = await wordSentence.findAll();
  // 多对多表不需要标题
  const wordSentencesMdStr = getWordSentencesMdContent(wordSentences, '').trim();
  return wordSentencesMdStr;
}

export async function getSeparateSynonymsMdStr() {
  const synonyms = await synonym.findAll();
  const synonymsMdStr = getSynonymsMdContent(synonyms, '').trim();
  return synonymsMdStr;
}

export async function getMergedMdStr(junctionTables: boolean) {
  const words = await word.findAll();
  const wordsMdStr = getWordsMdContent(words, '# words\n\n');

  const cnWords = await cnWord.findAll();
  const cnWordsMdStr = getCnWordsMdContent(cnWords, '# cnWords\n\n');

  const sentences = await sentence.findAll();
  const sentencesMdStr = getSentencesMdContent(sentences, '# sentences\n\n');

  let junctionTablesMdStr = '';
  if (junctionTables) {
    const wordSentences = await wordSentence.findAll();
    junctionTablesMdStr += getWordSentencesMdContent(wordSentences, '# wordSentences\n\n');
    const synonyms = await synonym.findAll();
    junctionTablesMdStr += getSynonymsMdContent(synonyms, '# synonyms\n\n');
  }

  const mdStr = `[toc]\n\n${wordsMdStr}${cnWordsMdStr}${sentencesMdStr}${junctionTablesMdStr}`.trim();
  return mdStr;
}
