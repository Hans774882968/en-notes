import { AxiosRequestConfig } from 'axios';

// resolve race condition https://juejin.cn/post/7176075684823957561
export default class RequestCanceler {
  static pendingRequest = new Map<string, AbortController>();

  static addPendingRequest(config: AxiosRequestConfig) {
    const requestKey = [config.url || '', config.method || ''].join(',');
    if (!this.pendingRequest.has(requestKey)) {
      const controller = new AbortController();
      config.signal = controller.signal;
      this.pendingRequest.set(requestKey, controller);
    } else {
      config.signal = this.pendingRequest.get(requestKey)?.signal;
    }
  }

  static removePendingRequest(config: AxiosRequestConfig) {
    const requestKey = config.url || '';
    if (!this.pendingRequest.has(requestKey)) return;
    this.pendingRequest.get(requestKey)?.abort();
    this.pendingRequest.delete(requestKey);
  }
}
