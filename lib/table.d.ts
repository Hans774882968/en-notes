import { CommonObjectType } from '@/typings/global';

export type TableParams<T extends CommonObjectType> = T & {
  pageNum: number
  pageSize: number
}

export type TableResp<T> = {
  rows: T[]
  total: number
}
