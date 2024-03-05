import { MaybeFalsy } from '@/typings/global';
import { isFalsyArray, removeFalsyAttrs, shouldBeEliminatedFalsy } from '@/lib/utils';

describe('removeFalsyAttrs', () => {
  it('false', () => {
    expect(removeFalsyAttrs({ x: true, y: false, z: 1 })).toStrictEqual({ x: true, z: 1 });
  });

  it('other falsy', () => {
    expect(removeFalsyAttrs({
      x: true,
      y1: 0,
      y2: -0,
      y3: 0n,
      y4: '',
      y5: null,
      y6: undefined,
      y7: NaN,
      z: 114514
    })).toStrictEqual({ x: true, z: 114514 });
  });

  it('with exceptionalFalsyValues', () => {
    expect(removeFalsyAttrs({
      x: true,
      y1: 0,
      y2: -0,
      y3: 0n,
      y4: '',
      y5: null,
      y6: undefined,
      y7: NaN,
      z: 114514
    }, ['', undefined])).toStrictEqual({ x: true, y4: '', y6: undefined, z: 114514 });

    expect(removeFalsyAttrs({
      x: true,
      y1: 0,
      y2: -0,
      y3: 0n,
      y4: '',
      y5: null,
      y6: undefined,
      y7: NaN,
      z: 114514
    }, ['', NaN])).toStrictEqual({ x: true, y4: '', y7: NaN, z: 114514 });
  });

  it('no side effect', () => {
    const o = { x: true, y: 0, z: '1919810' };
    expect(removeFalsyAttrs(o)).toStrictEqual({ x: true, z: '1919810' });
    expect(o).toStrictEqual({ x: true, y: 0, z: '1919810' });
  });

  const falsyValues: MaybeFalsy[] = [false, '', 0, +0, -0, NaN, 0n, null, undefined];

  it('isFalsyArray', () => {
    const cases = [
      [{}, false],
      [[], true],
      [falsyValues, true],
      [[{}, ''], false],
      [[false, 'false'], false]
    ];
    cases.forEach((cas) => {
      expect(isFalsyArray(cas[0])).toBe(cas[1]);
    });
  });

  it('shouldBeEliminatedFalsy', () => {
    expect(shouldBeEliminatedFalsy('false')).toBeFalsy();

    falsyValues.forEach((val) => {
      expect(shouldBeEliminatedFalsy(val)).toBeTruthy();
    });

    falsyValues.forEach((val) => {
      expect(shouldBeEliminatedFalsy(val, [val])).toBeFalsy();
    });

    falsyValues.forEach((val) => {
      const res1 = shouldBeEliminatedFalsy(val, [false, '']);
      expect(res1).toBe(!(val === false || val === ''));
      const res2 = shouldBeEliminatedFalsy(val, [false, '', NaN]);
      expect(res2).toBe(!(val === false || val === '' || (typeof val === 'number' && isNaN(val))));
    });
  });
});
