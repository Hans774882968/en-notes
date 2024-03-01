import { CnWord } from '@/db/models/types';
import { GetCnWordParams, GetCnWordResp } from '@/lib/backend/paramAndResp';
import { apiUrls } from '@/lib/backend/urls';
import Request from '@/lib/frontend/request';
import useSWR from 'swr';

interface UseGetCnWordParams {
  params: GetCnWordParams
  dialogOpen: boolean
  externalData?: CnWord
}

export default function useGetCnWord({ params, dialogOpen, externalData }: UseGetCnWordParams) {
  const shouldSendReq = dialogOpen && !externalData;
  const { data, isLoading } = useSWR(
    shouldSendReq ? [apiUrls.cnWord.get, params] : null,
    ([url, params]) => Request.get<GetCnWordResp>({ params, url })
  );
  if (!shouldSendReq) {
    return { cnWord: externalData, isLoading: false };
  }
  return { isLoading, ...data };
}
