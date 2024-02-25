import { getDatesByInterval } from '@/lib/date';

describe('test @/lib/date', () => {
  it('getDatesByInterval', () => {
    expect(getDatesByInterval(new Date('2000-02-28 00:00:00'), new Date('2000-03-02 00:00:00')))
      .toStrictEqual(['2000-02-28', '2000-02-29', '2000-03-01', '2000-03-02']);
    expect(getDatesByInterval(new Date('1900-02-28 00:00:00'), new Date('1900-03-02 00:00:00')))
      .toStrictEqual(['1900-02-28', '1900-03-01', '1900-03-02']);
    expect(getDatesByInterval(new Date('1902-02-28 00:00:00'), new Date('1902-02-28 00:00:00')))
      .toStrictEqual(['1902-02-28']);
    expect(getDatesByInterval(new Date('1902-02-28 00:00:00'), new Date('1902-02-27 00:00:00')))
      .toStrictEqual([]);
  });
});
