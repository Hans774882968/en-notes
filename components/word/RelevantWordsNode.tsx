import { Word } from '@/db/models/types';
import { WordInfoDialog } from './WordInfoDialog';
import { useState } from 'react';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import NoWordsRecorded from './NoWordsRecorded';

interface Props {
  words: Word[]
}

export default function RelevantWordsNode({ words }: Props) {
  const [currentWord, setCurrentWord] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDialog = (word: string) => {
    setCurrentWord(word);
    setIsModalOpen(true);
  };

  const handleDialogCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <WordInfoDialog
        onCancel={handleDialogCancel}
        open={isModalOpen}
        word={currentWord}
      />
      <Form.Item label="Relevant Words">
        {
          !words.length ? <NoWordsRecorded /> : (
            words.map(({ word }) => (
              <Button key={word} type="link" onClick={() => openDialog(word)}>{word}</Button>
            ))
          )
        }
      </Form.Item>
    </>
  );
}
