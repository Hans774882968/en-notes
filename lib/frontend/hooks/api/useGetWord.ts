import { GetWordParams, GetWordResp } from '@/lib/backend/paramAndResp';
import { Word } from '@/db/models/types';
import Request from '@/lib/frontend/request';
import useSWR from 'swr';

interface UseGetWordParams {
  params: GetWordParams
  dialogOpen: boolean
  externalData?: Word
}

export default function useGetWord({ params, dialogOpen, externalData }: UseGetWordParams) {
  const shouldSendReq = dialogOpen && !externalData;
  const { data, isLoading } = useSWR(
    shouldSendReq ? ['/api/getWord', params] : null,
    ([url, params]) => Request.get<GetWordResp>({ params, url })
  );
  if (!shouldSendReq) {
    return { isLoading: false, word: externalData };
  }
  return { isLoading, ...data };
}
