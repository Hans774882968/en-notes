import { Dayjs } from 'dayjs';
import { GetWordListParams, GetWordListResp } from '@/lib/backend/paramAndResp';
import { WORD_COMPLEXITY_INTRO } from '@/lib/frontend/const';
import { Word } from '@/db/models/types';
import { removeFalsyAttrs } from '@/lib/utils';
import { useState } from 'react';
import Button from 'antd/lib/button';
import CardDialog from '@/components/previewCard/CardDialog';
import DatePicker from 'antd/lib/date-picker';
import EnLayout from '@/components/EnLayout';
import EnNotesTable from '@/components/common/EnNotesTable';
import Input from 'antd/lib/input';
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import Request from '@/lib/frontend/request';
import Space from 'antd/lib/space';
import Tooltip from 'antd/lib/tooltip';
import WordInfoDialog from '@/components/word/WordInfoDialog';
import styles from './list.module.scss';

const { RangePicker } = DatePicker;

type BeforeGetWordListParams = Omit<GetWordListParams, 'ctime' | 'mtime'> & {
  ctime?: Dayjs[] | string[]
  mtime?: Dayjs[] | string[]
}

function ComplexityTooltip() {
  return (
    <>
      Complexity
      <Tooltip
        placement="top"
        title={WORD_COMPLEXITY_INTRO}
        overlayStyle={{ maxWidth: 300 }}
      >
        <QuestionCircleOutlined className={styles.complexityTooltip} />
      </Tooltip>
    </>
  );
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
      key: 'word',
      title: 'Word'
    },
    {
      dataIndex: 'complexity',
      key: 'complexity',
      title: <ComplexityTooltip />
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
      render: (word: string) => (
        <Space>
          <Button type="link" onClick={() => openWordInfoDialog(word)}>Detail</Button>
          <Button type="link" onClick={() => openWordCardDialog(word)}>Preview Card</Button>
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
          onCancel={handleWordInfoDialogCancel}
          open={isWordInfoDialogOpen}
          word={currentWord}
          externalData={dialogExternalData}
        />
        <CardDialog
          onCancel={handleWordCardDialogCancel}
          open={isWordCardDialogOpen}
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