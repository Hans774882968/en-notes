import { GetSentenceParams, GetSentenceResp } from '@/lib/backend/paramAndResp';
import { Sentence } from '@/db/models/types';
import { apiUrls } from '@/lib/backend/urls';
import Request from '@/lib/frontend/request';
import useSWR from 'swr';

interface UseGetSentenceParams {
  params: GetSentenceParams
  dialogOpen: boolean
  externalData?: Sentence
}

export default function useGetSentence({ params, dialogOpen, externalData }: UseGetSentenceParams) {
  const shouldSendReq = dialogOpen && !externalData;
  const { data, isLoading } = useSWR(
    shouldSendReq ? [apiUrls.sentence.get, params] : null,
    ([url, params]) => Request.get<GetSentenceResp>({ params, url })
  );
  if (!shouldSendReq) {
    return { isLoading: false, sentence: externalData };
  }
  return { isLoading, ...data };
}
