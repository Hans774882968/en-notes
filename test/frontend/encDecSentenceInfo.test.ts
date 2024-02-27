import { BelongSentence, DecodedSentence, decodeSentenceInfo, encodeSentenceInfo } from '@/lib/frontend/encDecSentenceInfo';

describe('encDecSentenceInfo', () => {
  const mockSentenceId = '1701948217849020416';
  const mockText = 'Some women like to talk about love, but this is merely a way to ask their partner for resources. They are rational and cold. They are not capable of love';
  const mockBase64 = 'MTcwMTk0ODIxNzg0OTAyMDQxNuOAgiBTb21lIHdvbWVuIGxpa2UgdG8gdGFsayBhYm91dCBsb3ZlLCBidXQgdGhpcyBpcyBtZXJlbHkgYSB3YXkgdG8gYXNrIHRoZWlyIHBhcnRuZXIgZm9yIHJlc291cmNlcy4gVGhleSBhcmUgcmF0aW9uYWwgYW5kIGNvbGQuIFRoZXkgYXJlIG5vdCBjYXBhYmxlIG9mIGxvdmU=';

  it('encodeSentenceInfo', () => {
    const cases: [BelongSentence, string][] = [
      [{ id: mockSentenceId, text: mockText }, mockBase64],
      [{ id: '', text: '' }, '44CCIA==']
    ];
    cases.forEach((cas) => {
      expect(encodeSentenceInfo(cas[0])).toBe(cas[1]);
    });
  });

  it('decodeSentenceInfo', () => {
    const cases: [string, DecodedSentence][] = [
      [mockBase64, { id: mockSentenceId, text: mockText }],
      ['44CCIA==', { id: '', text: '' }],
      ['', { id: '', text: '' }],
      ['foo', { id: '', text: '' }],
      ['foo 123', { id: '', text: '' }],
      ['\n\r\n fff', { id: '', text: '' }]
    ];
    cases.forEach((cas) => {
      expect(decodeSentenceInfo(cas[0])).toStrictEqual(cas[1]);
    });
  });
});
