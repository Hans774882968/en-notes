import { isNonEmptyArray } from '@/lib/utils';

describe('isNonEmptyArray', () => {
  it('isNonEmptyArray', () => {
    expect(isNonEmptyArray('ABC')).toBeFalsy();
    expect(isNonEmptyArray(null)).toBeFalsy();
    expect(isNonEmptyArray(undefined)).toBeFalsy();
    expect(isNonEmptyArray([1, '2'])).toBeTruthy();
    expect(isNonEmptyArray([])).toBeFalsy();
    expect(isNonEmptyArray(Array())).toBeFalsy();
  });
});
