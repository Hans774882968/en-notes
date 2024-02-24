import { ComplexityResp } from '../../paramAndResp';
import { calcCnWordComplexity, calcSentenceComplexity, calcWordComplexity } from '@/db/modelComplexity';
import { cnWord, sentence, word } from '@/db/models';

const wordIntervals = [0, 100, 200, 500, 1000, Infinity];
const sentenceIntervals = [0, 50, 100, 200, Infinity];
const cnWordIntervals = [0, 50, 100, 200, 500, 1000, Infinity];

function getIntervalIndex2Str(intervals: number[]) {
  return intervals.map((item, i) => {
    if (i === intervals.length - 1) return '';
    if (i === intervals.length - 2) return `[${item}, inf)`;
    return `[${item}, ${intervals[i + 1] - 1}]`;
  });
}

const wordIntervalIndex2Str = getIntervalIndex2Str(wordIntervals);
const sentenceIntervalIndex2Str = getIntervalIndex2Str(sentenceIntervals);
const cnWordIntervalIndex2Str = getIntervalIndex2Str(cnWordIntervals);

function getRecordComplexity(
  complexityList: number[],
  intervals: number[],
  intervalIndex2Str: string[]
) {
  const mp = complexityList.reduce((mp, len) => {
    for (let i = 0; i + 1 < intervals.length; ++i) {
      const left = intervals[i];
      const right = intervals[i + 1];
      if (!(left <= len && len < right)) continue;
      const v = mp.get(i) || 0;
      mp.set(i, v + 1);
      break;
    }
    return mp;
  }, new Map<number, number>());
  const res = Array.from(mp)
    .sort(([i1], [i2]) => i1 - i2)
    .reduce<ComplexityResp>(({ ranges, values }, [idx, v]) => {
      ranges.push(intervalIndex2Str[idx]);
      values.push(v);
      return { ranges, values };
    }, { ranges: [], values: [] });
  return res;
}

export async function getWordComplexity() {
  const words = await word.findAll({ include: sentence });
  const complexityList = words.map((item) => calcWordComplexity(item));
  const res = getRecordComplexity(complexityList, wordIntervals, wordIntervalIndex2Str);
  return res;
}

export async function getCnWordComplexity() {
  const cnWords = await cnWord.findAll();
  const complexityList = cnWords.map((item) => calcCnWordComplexity(item));
  const res = getRecordComplexity(complexityList, cnWordIntervals, cnWordIntervalIndex2Str);
  return res;
}

export async function getSentenceComplexity() {
  const sentences = await sentence.findAll();
  const complexityList = sentences.map((item) => calcSentenceComplexity(item));
  const res = getRecordComplexity(complexityList, sentenceIntervals, sentenceIntervalIndex2Str);
  return res;
}
