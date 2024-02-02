import { ThemeProvider } from '@/components/ThemeContext';
import { parseMarkdown } from '@/lib/markdown';
import { useRouter } from 'next/router';
import Empty from 'antd/lib/empty';
import Request from '@/lib/frontend/request';
import Spin from 'antd/lib/spin';
import useSWR from 'swr';

interface GetCnWordParams {
  word: string
}

interface GetCnWordResp {
  word: {
    ctime: string
    mtime: string
    word: string
    note: string
  }
}

function useCnWord(params: GetCnWordParams) {
  const { data, isLoading } = useSWR(
    ['/api/getCnWord', params],
    ([url, reqData]) => Request.get<GetCnWordResp>({ params: reqData, url })
  );
  return { cnWord: data?.word, isLoading };
}

export default function CnWordDisplay() {
  const router = useRouter();
  const { id = '' } = router.query;
  const { cnWord, isLoading } = useCnWord({ word: id.toString() });

  if (isLoading) {
    return <Spin />;
  }

  if (!cnWord) {
    return <Empty />;
  }

  return (
    <ThemeProvider>
      <div>
        <p>{cnWord.ctime}</p>
        <p>{cnWord.mtime}</p>
        <p>{cnWord.word}</p>
        <div dangerouslySetInnerHTML={{ __html: parseMarkdown(cnWord.note) }} />
      </div>
    </ThemeProvider>
  );
}
