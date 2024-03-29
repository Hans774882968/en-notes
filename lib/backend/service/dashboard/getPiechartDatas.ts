import { literal } from 'sequelize';
import { sentence, word } from '@/db/models';

/** TODO: 能否去掉子查询，从而不写业务代码
SELECT `count` AS `name`, COUNT(*) AS `value` FROM (
  SELECT `word`.`word`, COUNT(*) AS `count` FROM word INNER JOIN (synonym AS `itsSynonyms->synonym` INNER JOIN word AS itsSynonyms ON `itsSynonyms`.`word` = `itsSynonyms->synonym`.`rhs`) ON `word`.`word` = `itsSynonyms->synonym`.`lhs` GROUP BY word
) AS tmp GROUP BY tmp.count
 */
export function getCountingInfo(rawValueArray: number[], keyZeroCount: number) {
  const mp = rawValueArray.reduce((mp, count) => {
    const v = mp.get(count) || 0;
    mp.set(count, v + 1);
    return mp;
  }, new Map<number, number>([[0, keyZeroCount]]));
  const res = Array.from(mp.entries())
    .sort(([k1], [k2]) => k1 - k2)
    .map(([k, value]) => ({ name: String(k), value }));
  return res;
}

export async function getSynonymCount() {
  const synonymRes = await word.count({
    attributes: [
      'word',
      [literal('COUNT(*)'), 'count']
    ],
    group: 'word',
    include: [{ association: 'itsSynonyms', required: true }]
  });
  const wordTotal = await word.count();
  const noSynonymWordCount = wordTotal - synonymRes.length;
  const res = getCountingInfo(synonymRes.map(({ count }) => count), noSynonymWordCount);
  return res;
}

export async function getSentenceCountOfWord() {
  const sentenceRes = await word.count({
    attributes: [
      'word',
      [literal('COUNT(*)'), 'count']
    ],
    group: 'word',
    include: [{ model: sentence, required: true }]
  });
  const wordTotal = await word.count();
  const noSentenceWordCount = wordTotal - sentenceRes.length;
  const res = getCountingInfo(sentenceRes.map(({ count }) => count), noSentenceWordCount);
  return res;
}

export async function getWordCountOfSentence() {
  const wordRes = await sentence.count({
    attributes: [
      'id',
      [literal('COUNT(*)'), 'count']
    ],
    group: 'id',
    include: [{ model: word, required: true }]
  });
  const sentenceTotal = await sentence.count();
  const noWordSentenceCount = sentenceTotal - wordRes.length;
  const res = getCountingInfo(wordRes.map(({ count }) => count), noWordSentenceCount);
  return res;
}
