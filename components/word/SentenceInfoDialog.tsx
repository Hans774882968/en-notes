import { Sentence, SentenceIdType } from '@/db/models/types';
import { formLayout } from '@/lib/frontend/const';
import Form from 'antd/lib/form';
import LoadingInContainer from '../common/LoadingInContainer';
import MarkdownPreviewer from '../MarkdownPreviewer';
import Modal, { ModalProps } from 'antd/lib/modal';
import RelevantWordsNode from './RelevantWordsNode';
import useGetSentence from '@/lib/frontend/hooks/api/useGetSentence';

interface Props {
  sentenceId: SentenceIdType
  sentence: string
  open: boolean
  onCancel: ModalProps['onCancel']
  externalData?: Sentence
}

export default function SentenceInfoDialog({ sentenceId, sentence, open, onCancel, externalData }: Props) {
  const { sentence: sentenceRecord } = useGetSentence({
    dialogOpen: open,
    externalData,
    params: { sentence: sentenceId }
  });

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
