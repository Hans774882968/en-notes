import genFileNameAtFrontend from '@/lib/frontend/genFileNameAtFrontend';

describe('genFileNameAtFrontend', () => {
  const RealDate = Date;

  beforeEach(() => {
    globalThis.Date.now = jest.fn(() => new Date('2024-02-26 19:00:00').getTime());
  });

  afterEach(() => {
    globalThis.Date = RealDate;
  });

  it('doesn\'t pass meaningfulFileName', () => {
    const fName1 = genFileNameAtFrontend();
    const fName2 = genFileNameAtFrontend('');
    expect(fName1.length).toBe(13);
    expect(fName1.substring(0, 8)).toBe('24-02-26');
    expect(fName2.length).toBe(13);
    expect(fName2.substring(0, 8)).toBe('24-02-26');
  });

  it('passes meaningfulFileName', () => {
    expect(genFileNameAtFrontend('hans7')).toBe('hans7-24-02-26');
  });
});
