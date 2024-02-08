import { Resp } from '../resp';
import Message from 'antd/lib/message';
import RequestCanceler from './requestCanceler';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import fileDownload from 'js-file-download';

axios.interceptors.request.use(
  (config) => {
    config.timeout = 10000;
    RequestCanceler.removePendingRequest(config);
    RequestCanceler.addPendingRequest(config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    RequestCanceler.removePendingRequest(response.config);
    return Promise.resolve(response);
  },
  (error) => {
    RequestCanceler.removePendingRequest(error.config || {});
    return Promise.reject(error);
  }
);

export default class Request {
  static axiosObjectResolver<T>(axiosObject: Promise<AxiosResponse<Resp<T>, any>>) {
    return new Promise<T>((resolve, reject) => {
      axiosObject.then(res => {
        const resp = res?.data;
        if (!resp || resp?.retcode) {
          throw new Error(resp?.msg || '');
        }
        resolve(resp?.data);
      }).catch(err => {
        if (axios.isCancel(err)) {
          reject(err);
          return;
        }
        const content = err?.message || 'request error';
        console.error(content, err);
        Message.error({
          content
        });
        reject(err);
      });
    });
  }

  static get<T = any>({ url, params = {}}: { url: string, params?: Record<string, any> }) {
    return this.axiosObjectResolver<T>(
      axios.get(url, {
        params
      })
    );
  }

  static post<T = any>({ url, data }: { url: string, data: Record<string, any> }) {
    return this.axiosObjectResolver<T>(
      axios({
        data,
        method: 'post',
        url
      })
    );
  }

  static downloadAxiosObjResolver(axiosObject: Promise<AxiosResponse>) {
    return new Promise((resolve, reject) => {
      axiosObject.then((resp) => {
        const contentDisposition = resp.headers['content-disposition'];
        const fileName = contentDisposition.substring(contentDisposition.indexOf('filename=') + 9);
        fileDownload(resp.data, fileName);
        resolve(null);
      }).catch(err => {
        if (axios.isCancel(err)) {
          reject(err);
          return;
        }
        const content = err?.message || 'request error';
        console.error(content, err);
        Message.error({
          content
        });
        reject(err);
      });
    });
  }

  static downloadGet({ url, params = {}, onDownloadProgress }: {
    url: string
    params?: Record<string, any>
    onDownloadProgress?: AxiosRequestConfig['onDownloadProgress']
  }) {
    return this.downloadAxiosObjResolver(
      axios.get(url, {
        onDownloadProgress,
        params,
        responseType: 'blob'
      })
    );
  }

  static downloadPost({ url, data, onDownloadProgress }: {
    url: string,
    data: Record<string, any>
    onDownloadProgress?: AxiosRequestConfig['onDownloadProgress']
  }) {
    return this.downloadAxiosObjResolver(
      axios({
        data,
        method: 'post',
        onDownloadProgress,
        responseType: 'blob',
        url
      })
    );
  }
}
