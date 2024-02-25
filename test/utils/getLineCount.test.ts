import { getLineCount } from '@/lib/utils';

describe('getLineCount', () => {
  it('str', () => {
    expect(getLineCount('ABC')).toBe(1);
    expect(getLineCount('')).toBe(1);
    expect(getLineCount('111 222\r\n333  444')).toBe(2);
    expect(getLineCount('\n111 222\n333  444\n')).toBe(4);
  });

  it('non str', () => {
    expect(getLineCount(null)).toBe(1);
    expect(getLineCount(undefined)).toBe(1);
    expect(getLineCount([1, '2'])).toBe(1);
    expect(getLineCount([])).toBe(1);
  });
});
