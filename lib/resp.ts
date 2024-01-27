type Data = Record<string, any> | null;
export type RetMsg = {
  retcode: number
  msg: string
};
export type Resp = RetMsg & {
  data: Data
};

export function suc(data: Data): Resp {
  return {
    data,
    msg: '',
    retcode: 0
  };
}

export function fail({ retcode, msg }: RetMsg): Resp {
  return {
    data: null,
    msg,
    retcode
  };
}
