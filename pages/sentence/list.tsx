import { CardThemeProvider } from '@/components/common/contexts/CardThemeContext';
import { Dayjs } from 'dayjs';
import { GetSentenceListParams, GetSentenceListResp } from '@/lib/backend/paramAndResp';
import { SENTENCE_COMPLEXITY_INTRO } from '@/lib/frontend/const';
import { Sentence, SentenceIdType } from '@/db/models/types';
import { apiUrls } from '@/lib/backend/urls';
import { loginAsTheGodOfTheGods } from '@/lib/backend/perm';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Button from 'antd/lib/button';
import ComplexityTooltip from '@/components/list/ComplexityTooltip';
import DatePicker from 'antd/lib/date-picker';
import EnLayout from '@/components/EnLayout';
import EnNotesTable from '@/components/common/EnNotesTable';
import Input from 'antd/lib/input';
import Request from '@/lib/frontend/request';
import SentenceCardDialog from '@/components/previewCard/SentenceCardDialog';
import SentenceInfoDialog from '@/components/word/SentenceInfoDialog';
import Space from 'antd/lib/space';

const { RangePicker } = DatePicker;

type BeforeGetSentenceListParams = Omit<GetSentenceListParams, 'ctime' | 'mtime'> & {
  ctime?: Dayjs[] | string[]
  mtime?: Dayjs[] | string[]
}

export default function List() {
  // 正常用户不会设法（可以做到）去同时开两个对话框，为了省事， currentSentenceId 先共用了
  const [currentSentenceId, setCurrentSentenceId] = useState<SentenceIdType>('');

  const [isSentenceInfoDialogOpen, setIsSentenceInfoDialogOpen] = useState(false);
  const [isSentenceCardDialogOpen, setIsSentenceCardDialogOpen] = useState(false);

  const openSentenceInfoDialog = (sentenceId: SentenceIdType) => {
    setCurrentSentenceId(sentenceId);
    setIsSentenceInfoDialogOpen(true);
  };

  const handleSentenceInfoDialogCancel = () => {
    setIsSentenceInfoDialogOpen(false);
  };

  const openSentenceCardDialog = (sentenceId: SentenceIdType) => {
    setCurrentSentenceId(sentenceId);
    setIsSentenceCardDialogOpen(true);
  };

  const handleSentenceCardDialogCancel = () => {
    setIsSentenceCardDialogOpen(false);
  };

  const [cacheSentences, setCacheSentences] = useState<Sentence[]>([]);

  const { data: session } = useSession();
  // 只隐藏字段。接口还是得返回的，否则缺 rowKey
  const shouldShowSentenceId = loginAsTheGodOfTheGods(session);

  const columns = [
    {
      dataIndex: 'id',
      hidden: !shouldShowSentenceId,
      title: 'Sentence ID'
    },
    {
      dataIndex: 'sentence',
      title: 'Sentence',
      width: 200
    },
    {
      dataIndex: 'complexity',
      title: <ComplexityTooltip title={SENTENCE_COMPLEXITY_INTRO} />
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
      dataIndex: 'id',
      render: (sentenceId: SentenceIdType) => (
        <Space>
          <Button type="link" onClick={() => openSentenceInfoDialog(sentenceId)}>Detail</Button>
          <Button type="link" onClick={() => openSentenceCardDialog(sentenceId)}>Card</Button>
        </Space>
      ),
      title: 'Action'
    }
  ];

  // 这里 RangePicker 等组件不得不手动加 100% 去对齐输入框
  const searchConfigList = [
    ...(shouldShowSentenceId ? [{
      key: 'id',
      label: 'Sentence ID',
      slot: <Input placeholder="Please search" allowClear />
    }] : []),
    {
      key: 'sentence',
      label: 'Sentence',
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
  const beforeSearch = (params: BeforeGetSentenceListParams) => {
    params.ctime = params.ctime?.map((item) => typeof item === 'string' ? item : item.format('YYYY-MM-DD 00:00:00'));
    params.mtime = params.mtime?.map((item) => typeof item === 'string' ? item : item.format('YYYY-MM-DD 00:00:00'));
    return params;
  };

  const getSentenceList = async (params: GetSentenceListParams) => {
    try {
      const res = await Request.post<GetSentenceListResp>({ data: params, url: apiUrls.sentence.list });
      setCacheSentences(res.rows);
      return res;
    } catch (e) {
      setCacheSentences([]);
      return { rows: [], total: 0 };
    }
  };

  const dialogExternalData = cacheSentences.find((item) => item.id === currentSentenceId);
  const dialogDataSentenceText = dialogExternalData?.sentence || '';

  return (
    <EnLayout>
      <div>
        <SentenceInfoDialog
          onCancel={handleSentenceInfoDialogCancel}
          open={isSentenceInfoDialogOpen}
          sentenceId={currentSentenceId}
          sentence={dialogDataSentenceText}
          externalData={dialogExternalData}
        />
        <CardThemeProvider>
          <SentenceCardDialog
            onCancel={handleSentenceCardDialogCancel}
            open={isSentenceCardDialogOpen}
            sentenceId={currentSentenceId}
            sentence={dialogDataSentenceText}
            externalData={dialogExternalData}
          />
        </CardThemeProvider>
        <EnNotesTable
          rowKey="id"
          columns={columns}
          searchConfigList={searchConfigList}
          requestKey={apiUrls.sentence.list}
          apiFun={getSentenceList}
          beforeSearch={beforeSearch}
        />
      </div>
    </EnLayout>
  );
}
