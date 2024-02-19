import { CommonObjectType } from '@/typings/global';

type Data = CommonObjectType<any> | null;
export type RetMsg = {
  retcode: number
  msg: string
};
export type Resp<T = Data> = RetMsg & {
  data: T
};

export function suc<T = Data>(data: T): Resp<T> {
  return {
    data,
    msg: '',
    retcode: 0
  };
}

export function fail({ retcode, msg }: RetMsg): Resp<null> {
  return {
    data: null,
    msg,
    retcode
  };
}
