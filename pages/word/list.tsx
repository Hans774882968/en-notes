import { CardThemeProvider } from '@/components/common/contexts/CardThemeContext';
import { Dayjs } from 'dayjs';
import { GetWordListParams, GetWordListResp } from '@/lib/backend/paramAndResp';
import { WORD_COMPLEXITY_INTRO } from '@/lib/frontend/const';
import { Word } from '@/db/models/types';
import { apiUrls } from '@/lib/backend/urls';
import { useState } from 'react';
import Button from 'antd/lib/button';
import ComplexityTooltip from '@/components/list/ComplexityTooltip';
import DatePicker from 'antd/lib/date-picker';
import EnLayout from '@/components/EnLayout';
import EnNotesTable from '@/components/common/EnNotesTable';
import Input from 'antd/lib/input';
import Request from '@/lib/frontend/request';
import Space from 'antd/lib/space';
import WordCardDialog from '@/components/previewCard/WordCardDialog';
import WordInfoDialog from '@/components/word/WordInfoDialog';

const { RangePicker } = DatePicker;

type BeforeGetWordListParams = Omit<GetWordListParams, 'ctime' | 'mtime'> & {
  ctime?: Dayjs[] | string[]
  mtime?: Dayjs[] | string[]
}

export default function List() {
  // 正常用户不会设法（可以做到）去同时开两个对话框，为了省事， currentWord 先共用了
  const [currentWord, setCurrentWord] = useState('');

  const [isWordInfoDialogOpen, setIsWordInfoDialogOpen] = useState(false);
  const [isWordCardDialogOpen, setIsWordCardDialogOpen] = useState(false);

  const openWordInfoDialog = (word: string) => {
    setCurrentWord(word);
    setIsWordInfoDialogOpen(true);
  };

  const handleWordInfoDialogCancel = () => {
    setIsWordInfoDialogOpen(false);
  };

  const openWordCardDialog = (word: string) => {
    setCurrentWord(word);
    setIsWordCardDialogOpen(true);
  };

  const handleWordCardDialogCancel = () => {
    setIsWordCardDialogOpen(false);
  };

  const [cacheWords, setCacheWords] = useState<Word[]>([]);

  const columns = [
    {
      dataIndex: 'word',
      title: 'Word'
    },
    {
      dataIndex: 'complexity',
      title: <ComplexityTooltip title={WORD_COMPLEXITY_INTRO} />
    },
    {
      dataIndex: 'synonymCount',
      title: 'Number of Synonyms'
    },
    {
      dataIndex: 'ctime',
      title: 'Create Time'
    },
    {
      dataIndex: 'mtime',
      title: 'Modify Time'
    },
    {
      dataIndex: 'word',
      render: (word: string) => (
        <Space>
          <Button type="link" onClick={() => openWordInfoDialog(word)}>Detail</Button>
          <Button type="link" onClick={() => openWordCardDialog(word)}>Card</Button>
          {/* Export Card 直接放外面这个功能的实现难度太大，不做了 */}
        </Space>
      ),
      title: 'Action'
    }
  ];

  // 这里 RangePicker 等组件不得不手动加 100% 去对齐输入框
  const searchConfigList = [
    {
      key: 'word',
      label: 'Word',
      slot: <Input placeholder="Please search" allowClear />
    },
    {
      key: 'note',
      label: 'Note',
      slot: <Input placeholder="Please search" allowClear />
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

  // 这里不能调 removeFalsyAttrs 否则在清掉某个原来值为空字符串的字段后，覆盖不掉原来的值，会造成 bug 。要根本上解决这个问题必须把 beforeSearch 调用时机延后
  const beforeSearch = (params: BeforeGetWordListParams) => {
    params.ctime = params.ctime?.map((item) => typeof item === 'string' ? item : item.format('YYYY-MM-DD 00:00:00'));
    params.mtime = params.mtime?.map((item) => typeof item === 'string' ? item : item.format('YYYY-MM-DD 00:00:00'));
    return params;
  };

  const getWordList = async (params: GetWordListParams) => {
    try {
      const res = await Request.post<GetWordListResp>({ data: params, url: apiUrls.word.list });
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
          onCancel={handleWordInfoDialogCancel}
          open={isWordInfoDialogOpen}
          word={currentWord}
          externalData={dialogExternalData}
        />
        <CardThemeProvider>
          <WordCardDialog
            onCancel={handleWordCardDialogCancel}
            open={isWordCardDialogOpen}
            word={currentWord}
            externalData={dialogExternalData}
          />
        </CardThemeProvider>
        <EnNotesTable
          rowKey="word"
          columns={columns}
          searchConfigList={searchConfigList}
          requestKey={apiUrls.word.list}
          apiFun={getWordList}
          beforeSearch={beforeSearch}
        />
      </div>
    </EnLayout>
  );
}
