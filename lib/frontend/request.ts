import Message from 'antd/lib/message';
import axios from 'axios';

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
  static get<T = any>({ url, params = {}}: { url: string, params?: Record<string, any> }):
    Promise<T> {
    return new Promise((resolve, reject) => {
      axios.get(url, {
        params
      }).then(res => {
        resolve(res?.data?.data);
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

  static post<T = any>({ url, data }: { url: string, data: Record<string, any> }):
    Promise<T> {
    return new Promise((resolve, reject) => {
      axios({
        data,
        method: 'post',
        url
      }).then(res => {
        resolve(res?.data?.data);
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
}
