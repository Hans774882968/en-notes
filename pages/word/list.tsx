import { Dayjs } from 'dayjs';
import { GetWordListParams, GetWordListResp } from '@/lib/backend/paramAndResp';
import { Word } from '@/db/models/types';
import { WordInfoDialog } from '@/components/word/WordInfoDialog';
import { removeFalsyAttrs } from '@/lib/utils';
import { useState } from 'react';
import Button from 'antd/lib/button';
import DatePicker from 'antd/lib/date-picker';
import EnLayout from '@/components/EnLayout';
import EnNotesTable from '@/components/common/EnNotesTable';
import Input from 'antd/lib/input';
import Request from '@/lib/frontend/request';

const { RangePicker } = DatePicker;

type BeforeGetWordListParams = Omit<GetWordListParams, 'ctime' | 'mtime'> & {
  ctime?: Dayjs[] | string[]
  mtime?: Dayjs[] | string[]
}

export default function List() {
  const [currentWord, setCurrentWord] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDialog = (word: string) => {
    setCurrentWord(word);
    setIsModalOpen(true);
  };

  const handleDialogCancel = () => {
    setIsModalOpen(false);
  };

  const [cacheWords, setCacheWords] = useState<Word[]>([]);

  const columns = [
    {
      dataIndex: 'word',
      key: 'word',
      title: 'Word'
    },
    {
      dataIndex: 'complexity',
      key: 'complexity',
      title: 'Complexity'
    },
    {
      dataIndex: 'synonymCount',
      key: 'synonymCount',
      title: 'Number of Synonyms'
    },
    {
      dataIndex: 'ctime',
      key: 'ctime',
      title: 'Create Time'
    },
    {
      dataIndex: 'mtime',
      key: 'mtime',
      title: 'Modify Time'
    },
    {
      dataIndex: 'word',
      render: (word: string) => (<Button type="link" onClick={() => openDialog(word)}>Detail</Button>),
      title: 'Action'
    }
  ];

  // 这里 RangePicker 等组件不得不手动加 100% 去对齐输入框
  const searchConfigList = [
    {
      key: 'word',
      label: 'Word',
      slot: <Input allowClear />
    },
    {
      key: 'note',
      label: 'Note',
      slot: <Input allowClear />
    },
    {
      key: 'ctime',
      label: 'Create Time',
      slot: <RangePicker style={{ width: '100%' }} />
    },
    {
      key: 'mtime',
      label: 'Modify Time',
      slot: <RangePicker style={{ width: '100%' }} />
    }
  ];

  const beforeSearch = (params: BeforeGetWordListParams) => {
    params.ctime = params.ctime?.map((item) => typeof item === 'string' ? item : item.format('YYYY-MM-DD 00:00:00'));
    params.mtime = params.mtime?.map((item) => typeof item === 'string' ? item : item.format('YYYY-MM-DD 00:00:00'));
    removeFalsyAttrs(params);
  };

  const getWordList = async (params: GetWordListParams) => {
    try {
      const res = await Request.post<GetWordListResp>({ data: params, url: '/api/word/list' });
      setCacheWords(res.rows);
      return res;
    } catch (e) {
      setCacheWords([]);
      return { rows: [], total: 0 };
    }
  };

  const dialogExternalData = cacheWords.find((item) => item.word === currentWord);

  return (
    <EnLayout>
      <div>
        <WordInfoDialog
          onCancel={handleDialogCancel}
          open={isModalOpen}
          word={currentWord}
          externalData={dialogExternalData}
        />
        <EnNotesTable
          rowKey="word"
          columns={columns}
          searchConfigList={searchConfigList}
          apiFun={getWordList}
          beforeSearch={beforeSearch}
        />
      </div>
    </EnLayout>
  );
}
