import { GetWordParams, GetWordResp } from '@/lib/backend/paramAndResp';
import { Word } from '@/db/models/types';
import { apiUrls } from '@/lib/backend/urls';
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
    shouldSendReq ? [apiUrls.word.get, params] : null,
    ([url, params]) => Request.get<GetWordResp>({ params, url })
  );
  if (!shouldSendReq) {
    return { isLoading: false, word: externalData };
  }
  return { isLoading, ...data };
}
