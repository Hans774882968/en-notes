import { ThemeProvider } from '@/components/ThemeContext';
import { parseMarkdown } from '@/lib/markdown';
import Empty from 'antd/lib/empty';
import Request from '@/lib/frontend/request';
import Spin from 'antd/lib/spin';
import useSWR from 'swr';

type CnWord = {
  word: string
  note: string
  ctime: string
  mtime: string
};

type GetAllCnWordsResp = {
  words: CnWord[]
};

function useCnWords() {
  const { data, isLoading } = useSWR<GetAllCnWordsResp, any, string>(
    '/api/getAllCnWords',
    (url) => Request.get({ url })
  );
  return { cnWords: data?.words, isLoading };
}

export default function CnWordsDisplay() {
  const { cnWords, isLoading } = useCnWords();

  if (isLoading) {
    return <Spin />;
  }

  if (!cnWords) {
    return <Empty />;
  }

  return (
    <ThemeProvider>
      {
        cnWords?.map((cnWord) => {
          return (
            <div key={cnWord.word}>
              <p>{cnWord.ctime}</p>
              <p>{cnWord.mtime}</p>
              <p>{cnWord.word}</p>
              <div dangerouslySetInnerHTML={{ __html: parseMarkdown(cnWord.note) }} />
            </div>
          );
        })
      }
    </ThemeProvider>
  );
}
