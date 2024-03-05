import { CN_WORD_COMPLEXITY_INTRO } from '@/lib/frontend/const';
import { CardThemeProvider } from '@/components/common/contexts/CardThemeContext';
import { CnWord } from '@/db/models/types';
import { Dayjs } from 'dayjs';
import { GetCnWordListParams, GetCnWordListResp } from '@/lib/backend/paramAndResp';
import { apiUrls } from '@/lib/backend/urls';
import { useState } from 'react';
import Button from 'antd/lib/button';
import CnWordCardDialog from '@/components/previewCard/CnWordCardDialog';
import CnWordInfoDialog from '@/components/cnWord/CnWordInfoDialog';
import ComplexityTooltip from '@/components/list/ComplexityTooltip';
import DatePicker from 'antd/lib/date-picker';
import EnLayout from '@/components/EnLayout';
import EnNotesTable from '@/components/common/EnNotesTable';
import Input from 'antd/lib/input';
import Request from '@/lib/frontend/request';
import Space from 'antd/lib/space';

const { RangePicker } = DatePicker;

type BeforeGetCnWordListParams = Omit<GetCnWordListParams, 'ctime' | 'mtime'> & {
  ctime?: Dayjs[] | string[]
  mtime?: Dayjs[] | string[]
}

export default function List() {
  // 正常用户不会设法（可以做到）去同时开两个对话框，为了省事， currentCnWord 先共用了
  const [currentCnWord, setCurrentCnWord] = useState('');

  const [isCnWordInfoDialogOpen, setIsCnWordInfoDialogOpen] = useState(false);
  const [isCnWordCardDialogOpen, setIsCnWordCardDialogOpen] = useState(false);

  const openCnWordInfoDialog = (cnWord: string) => {
    setCurrentCnWord(cnWord);
    setIsCnWordInfoDialogOpen(true);
  };

  const handleCnWordInfoDialogCancel = () => {
    setIsCnWordInfoDialogOpen(false);
  };

  const openCnWordCardDialog = (cnWord: string) => {
    setCurrentCnWord(cnWord);
    setIsCnWordCardDialogOpen(true);
  };

  const handleCnWordCardDialogCancel = () => {
    setIsCnWordCardDialogOpen(false);
  };

  const [cacheCnWords, setCacheCnWords] = useState<CnWord[]>([]);

  const columns = [
    {
      dataIndex: 'word',
      title: 'Title'
    },
    {
      dataIndex: 'complexity',
      title: <ComplexityTooltip title={CN_WORD_COMPLEXITY_INTRO} />
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
          <Button type="link" onClick={() => openCnWordInfoDialog(word)}>Detail</Button>
          <Button type="link" onClick={() => openCnWordCardDialog(word)}>Card</Button>
        </Space>
      ),
      title: 'Action'
    }
  ];

  // 这里 RangePicker 等组件不得不手动加 100% 去对齐输入框
  const searchConfigList = [
    {
      key: 'word',
      label: 'Title',
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
  const beforeSearch = (params: BeforeGetCnWordListParams) => {
    params.ctime = params.ctime?.map((item) => typeof item === 'string' ? item : item.format('YYYY-MM-DD 00:00:00'));
    params.mtime = params.mtime?.map((item) => typeof item === 'string' ? item : item.format('YYYY-MM-DD 00:00:00'));
    return params;
  };

  const getCnWordList = async (params: GetCnWordListParams) => {
    try {
      const res = await Request.post<GetCnWordListResp>({ data: params, url: apiUrls.cnWord.list });
      setCacheCnWords(res.rows);
      return res;
    } catch (e) {
      setCacheCnWords([]);
      return { rows: [], total: 0 };
    }
  };

  const dialogExternalData = cacheCnWords.find((item) => item.word === currentCnWord);

  return (
    <EnLayout>
      <div>
        <CnWordInfoDialog
          onCancel={handleCnWordInfoDialogCancel}
          open={isCnWordInfoDialogOpen}
          word={currentCnWord}
          externalData={dialogExternalData}
        />
        <CardThemeProvider>
          <CnWordCardDialog
            onCancel={handleCnWordCardDialogCancel}
            open={isCnWordCardDialogOpen}
            word={currentCnWord}
            externalData={dialogExternalData}
          />
        </CardThemeProvider>
        <EnNotesTable
          rowKey="word"
          columns={columns}
          searchConfigList={searchConfigList}
          requestKey={apiUrls.cnWord.list}
          apiFun={getCnWordList}
          beforeSearch={beforeSearch}
        />
      </div>
    </EnLayout>
  );
}
