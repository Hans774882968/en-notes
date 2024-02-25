import { removeFalsyAttrs } from '@/lib/utils';

describe('removeFalsyAttrs', () => {
  it('false', () => {
    expect(removeFalsyAttrs({ x: true, y: false, z: 1 })).toStrictEqual({ x: true, z: 1 });
  });

  it('other falsy', () => {
    expect(removeFalsyAttrs({
      x: true,
      y1: 0,
      y2: -0,
      y3: BigInt(0),
      y4: '',
      y5: null,
      y6: undefined,
      y7: NaN,
      z: 114514
    })).toStrictEqual({ x: true, z: 114514 });
  });

  it('no side effect', () => {
    const o = { x: true, y: 0, z: '1919810' };
    expect(removeFalsyAttrs(o)).toStrictEqual({ x: true, z: '1919810' });
    expect(o).toStrictEqual({ x: true, y: 0, z: '1919810' });
  });
});
