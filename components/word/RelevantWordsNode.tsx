import { BelongSentence } from '@/lib/frontend/encDecSentenceInfo';
import { Word } from '@/db/models/types';
import { useState } from 'react';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import NoWordsRecorded from './NoWordsRecorded';
import WordInfoDialog from './WordInfoDialog';

interface Props {
  words: Word[]
  belongSentence: BelongSentence
}

export default function RelevantWordsNode({ words, belongSentence }: Props) {
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
          !words.length ? <NoWordsRecorded belongSentence={belongSentence} /> : (
            words.map(({ word }) => (
              <Button key={word} type="link" onClick={() => openDialog(word)}>{word}</Button>
            ))
          )
        }
      </Form.Item>
    </>
  );
}
