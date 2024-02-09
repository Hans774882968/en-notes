import { GetWordParams, GetWordResp } from '@/lib/backend/paramAndResp';
import { formLayout } from '@/lib/const';
import { useState } from 'react';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import MarkdownPreviewer from '../MarkdownPreviewer';
import Modal, { ModalProps } from 'antd/lib/modal';
import Request from '@/lib/frontend/request';
import SentencesItem from './SentencesItem';
import useSWR from 'swr';

interface Props {
  word: string
  open: boolean
  onCancel: ModalProps['onCancel']
}

function useGetWord(params: GetWordParams, dialogOpen: boolean) {
  const { data, isLoading } = useSWR(
    dialogOpen ? ['/api/getWord', params] : null,
    ([url, params]) => Request.get<GetWordResp>({ params, url })
  );
  return { isLoading, ...data };
}

export function WordInfoDialog({ word, open, onCancel }: Props) {
  const { word: wordRecord } = useGetWord({ word }, open);

  const [currentNextWord, setCurrentNextWord] = useState('');
  const [isNextModalOpen, setIsNextModalOpen] = useState(false);

  const openNextDialog = (word: string) => {
    setCurrentNextWord(word);
    setIsNextModalOpen(true);
  };

  const handleNextDialogCancel = () => {
    setIsNextModalOpen(false);
  };

  const synonymsNode = wordRecord?.itsSynonyms.length ? (
    wordRecord?.itsSynonyms.map(({ word }) => (
      <Button key={word} type="link" onClick={() => openNextDialog(word)}>{word}</Button>
    ))
  ) : <span>No synonyms recorded yet</span>;

  return (
    <>
      {
        isNextModalOpen && (
          <WordInfoDialog
            onCancel={handleNextDialogCancel}
            open={isNextModalOpen}
            word={currentNextWord}
          />
        )
      }
      <Modal
        title={word}
        open={open}
        onCancel={onCancel}
        width={1200}
        footer={[]}
      >
        {
          !wordRecord ? <span>No data</span> : (
            <Form {...formLayout}>
              <Form.Item label="Synonyms">
                {synonymsNode}
              </Form.Item>
              <SentencesItem sentences={wordRecord.sentences} />
              <Form.Item label="Create Time">
                <span>{wordRecord.ctime}</span>
              </Form.Item>
              <Form.Item label="Modify Time">
                <span>{wordRecord.mtime}</span>
              </Form.Item>
              <Form.Item label="Note">
                <MarkdownPreviewer value={wordRecord.note} />
              </Form.Item>
            </Form>
          )
        }
      </Modal>
    </>
  );
}
