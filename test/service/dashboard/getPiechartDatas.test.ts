import { getCountingInfo } from '@/lib/backend/service/dashboard/getPiechartDatas';

describe('getPiechartDatas', () => {
  it('getCountingInfo', () => {
    expect(getCountingInfo([7, 2, 1, 5, 5, 7, 3, 1, 2, 5, 3, 7], 11)).toStrictEqual([
      { name: '0', value: 11 },
      { name: '1', value: 2 },
      { name: '2', value: 2 },
      { name: '3', value: 2 },
      { name: '5', value: 3 },
      { name: '7', value: 3 }
    ]);
  });
});
