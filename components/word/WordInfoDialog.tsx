import { Word } from '@/db/models/types';
import { formLayout } from '@/lib/frontend/const';
import { useState } from 'react';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import LoadingInContainer from '../common/LoadingInContainer';
import MarkdownPreviewer from '../MarkdownPreviewer';
import Modal, { ModalProps } from 'antd/lib/modal';
import SentencesItem from './SentencesItem';
import SynonymsDisplay from './SynonymsDisplay';
import useGetWord from '@/lib/frontend/hooks/api/useGetWord';

/**
 * 单词详情对话框
 * @param {Word} externalData 若指定外部数据源，则直接使用，不发请求
 */

interface Props {
  word: string
  externalData?: Word
  open: boolean
  onCancel: ModalProps['onCancel']
}

export default function WordInfoDialog({ word, open, onCancel, externalData }: Props) {
  const { word: wordRecord } = useGetWord({
    dialogOpen: open,
    externalData,
    params: { word }
  });

  const [currentNextWord, setCurrentNextWord] = useState('');
  const [isNextModalOpen, setIsNextModalOpen] = useState(false);

  const openNextDialog = (word: string) => {
    setCurrentNextWord(word);
    setIsNextModalOpen(true);
  };

  const handleNextDialogCancel = () => {
    setIsNextModalOpen(false);
  };

  const synonymsChildren = wordRecord?.itsSynonyms.length ? (
    wordRecord?.itsSynonyms.map(({ word }) => (
      <Button key={word} type="link" onClick={() => openNextDialog(word)}>{word}</Button>
    ))
  ) : null;

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
          !wordRecord ? <LoadingInContainer /> : (
            <Form {...formLayout}>
              <Form.Item label="Synonyms">
                <SynonymsDisplay belongWord={word}>
                  {synonymsChildren}
                </SynonymsDisplay>
              </Form.Item>
              <SentencesItem belongWord={word} sentences={wordRecord.sentences} />
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
