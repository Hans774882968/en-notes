import { MaybeFalsy } from '@/typings/global';
import { omit } from 'lodash-es';

export const isSubSequence = (long: string, short: string, caseSensitive = false) => {
  if (!short) return true;
  if (long.length < short.length) return false;
  const longStr = caseSensitive ? long : long.toLowerCase();
  const shortStr = caseSensitive ? short : short.toLowerCase();
  if (longStr.length === shortStr.length && longStr !== shortStr) return false;
  let j = 0;
  for (let i = 0;i < longStr.length;++i) {
    if (longStr[i] !== shortStr[j]) continue;
    ++j;
    if (j === shortStr.length) return true;
  }
  return j === shortStr.length;
};

export const isFalsyArray = (a: unknown): a is MaybeFalsy[] => {
  return Array.isArray(a) && a.every((v) => !v);
};

export const shouldBeEliminatedFalsy = (v: unknown, exceptionalFalsyValues?: MaybeFalsy[]) => {
  if (v) return false;
  if (!exceptionalFalsyValues) return true;
  return exceptionalFalsyValues.every((item) => {
    if (typeof item !== typeof v) return true;
    if (typeof item === 'number' && isNaN(item) && typeof v === 'number' && isNaN(v)) {
      return false;
    }
    return item !== v;
  });
};

export const removeFalsyAttrs = <T extends object>(o: T, exceptionalFalsyValues?: MaybeFalsy[]) => {
  if (exceptionalFalsyValues && !isFalsyArray(exceptionalFalsyValues)) {
    throw new TypeError(`expected falsy array, but got: ${exceptionalFalsyValues}`);
  }
  const attrs = Object.entries(o).reduce<string[]>((attrs, [k, v]) => {
    if (shouldBeEliminatedFalsy(v, exceptionalFalsyValues)) {
      attrs.push(k);
    }
    return attrs;
  }, []);
  const res = omit<T>(o, attrs);
  return res;
};

export const isNonEmptyArray = (a: unknown): a is any[] => {
  return Array.isArray(a) && a.length > 0;
};

export const getLineCount = (s: unknown) => {
  if (!s) return 1;
  return (String(s).match(/\n/g) || '').length + 1;
};
