import { Resp } from '../resp';
import Message from 'antd/lib/message';
import axios, { AxiosResponse } from 'axios';
import fileDownload from 'js-file-download';

axios.interceptors.request.use(
  (config) => {
    config.timeout = 10000;
    return config;
  },
  (error) => {
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
        const content = err.message || 'request error';
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
    return axiosObject.then((resp) => {
      const contentDisposition = resp.headers['content-disposition'];
      const fileName = contentDisposition.substring(contentDisposition.indexOf('filename=') + 9);
      fileDownload(resp.data, fileName);
    }).catch(err => {
      const content = err.message || 'request error';
      console.error(content, err);
      Message.error({
        content
      });
    });
  }

  static downloadGet({ url, params = {}}: { url: string, params?: Record<string, any> }) {
    return this.downloadAxiosObjResolver(
      axios.get(url, {
        params,
        responseType: 'blob'
      })
    );
  }

  static downloadPost({ url, data }: { url: string, data: Record<string, any> }) {
    return this.downloadAxiosObjResolver(
      axios({
        data,
        method: 'post',
        url
      })
    );
  }
}
