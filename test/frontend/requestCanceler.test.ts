import { AxiosRequestConfig } from 'axios';
import RequestCanceler from '@/lib/frontend/requestCanceler';

describe('requestCanceler', () => {
  it('requestCanceler', () => {
    RequestCanceler.removePendingRequest({ url: 'foo' });
    expect(RequestCanceler.pendingRequest).toStrictEqual(new Map());

    const config1: AxiosRequestConfig = { method: 'GET', url: 'foo' };
    RequestCanceler.addPendingRequest(config1);
    expect(config1.signal).toBeInstanceOf(AbortSignal);
    expect(Array.from(RequestCanceler.pendingRequest.keys())).toStrictEqual(['foo,GET']);

    const config2: AxiosRequestConfig = { method: 'POST', url: 'foo' };
    RequestCanceler.addPendingRequest(config2);
    expect(config2.signal).toBeInstanceOf(AbortSignal);
    expect(Array.from(RequestCanceler.pendingRequest.keys())).toStrictEqual(['foo,GET', 'foo,POST']);

    RequestCanceler.removePendingRequest(config1);
    expect(Array.from(RequestCanceler.pendingRequest.keys())).toStrictEqual(['foo,POST']);
  });
});
