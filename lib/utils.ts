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

export const removeFalsyAttrs = (o: object) => {
  const attrs = Object.entries(o).reduce<string[]>((attrs, [k, v]) => {
    if (!v) {
      attrs.push(k);
    }
    return attrs;
  }, []);
  const res = omit(o, attrs);
  return res;
};

export const isNonEmptyArray = (a: unknown) => {
  return Array.isArray(a) && a.length > 0;
};

export const getLineCount = (s: unknown) => {
  if (!s) return 1;
  return (String(s).match(/\n/g) || '').length + 1;
};
