import { GetSentenceParams, GetSentenceResp } from '@/lib/backend/paramAndResp';
import { SentenceIdType } from '@/db/models/types';
import { apiUrls } from '@/lib/backend/urls';
import { formLayout } from '@/lib/frontend/const';
import Form from 'antd/lib/form';
import LoadingInContainer from '../common/LoadingInContainer';
import MarkdownPreviewer from '../MarkdownPreviewer';
import Modal, { ModalProps } from 'antd/lib/modal';
import RelevantWordsNode from './RelevantWordsNode';
import Request from '@/lib/frontend/request';
import useSWR from 'swr';

interface Props {
  sentenceId: SentenceIdType
  sentence: string
  open: boolean
  onCancel: ModalProps['onCancel']
}

function useGetSentence(params: GetSentenceParams, dialogOpen: boolean) {
  const { data, isLoading } = useSWR(
    dialogOpen ? [apiUrls.sentence.get, params] : null,
    ([url, params]) => Request.get<GetSentenceResp>({ params, url })
  );
  return { isLoading, ...data };
}

export default function SentenceInfoDialog({ sentenceId, sentence, open, onCancel }: Props) {
  const { sentence: sentenceRecord } = useGetSentence({ sentence: sentenceId }, open);

  return (
    <Modal
      title={sentence}
      open={open}
      onCancel={onCancel}
      width={1200}
      footer={[]}
    >
      {
        !sentenceRecord ? <LoadingInContainer /> : (
          <Form {...formLayout}>
            <RelevantWordsNode belongSentence={{ id: sentenceId, text: sentence }} words={sentenceRecord.words} />
            <Form.Item label="Create Time">
              <span>{sentenceRecord.ctime}</span>
            </Form.Item>
            <Form.Item label="Modify Time">
              <span>{sentenceRecord.mtime}</span>
            </Form.Item>
            <Form.Item label="Note">
              <MarkdownPreviewer value={sentenceRecord.note} />
            </Form.Item>
          </Form>
        )
      }
    </Modal>
  );
}
