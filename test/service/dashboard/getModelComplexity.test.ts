import { exportedForTesting } from '@/lib/backend/service/dashboard/getModelComplexity';

const { getIntervalIndex2Str, getRecordComplexity } = exportedForTesting;

describe('getModelComplexity', () => {
  it('getIntervalIndex2Str', () => {
    expect(getIntervalIndex2Str([0, 100, 200, 500, 1000, Infinity])).toStrictEqual(
      ['[0, 99]', '[100, 199]', '[200, 499]', '[500, 999]', '[1000, inf)', '']
    );
  });

  it('getRecordComplexity', () => {
    const complexityList = [0, 199, 666, 100, 999, 99, 111, 114514, 1000, 50];
    const wordIntervals = [0, 100, 200, 500, 1000, Infinity];
    const wordIntervalIndex2Str = getIntervalIndex2Str(wordIntervals);
    const res = getRecordComplexity(complexityList, wordIntervals, wordIntervalIndex2Str);
    expect(res).toStrictEqual(
      { ranges: ['[0, 99]', '[100, 199]', '[500, 999]', '[1000, inf)'], values: [3, 3, 2, 2] }
    );
  });
});
