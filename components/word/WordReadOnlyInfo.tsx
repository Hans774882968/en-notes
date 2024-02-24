import { Sentence, Word } from '@/db/models/types';
import { WordInfoDialog } from './WordInfoDialog';
import { useState } from 'react';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import NoSynonymsRecorded from './NoSynonymsRecorded';
import SentencesItem from './SentencesItem';

function SynonymsNode({ synonyms }: { synonyms: Word[] }) {
  const [currentWord, setCurrentWord] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDialog = (word: string) => {
    setCurrentWord(word);
    setIsModalOpen(true);
  };

  const handleDialogCancel = () => {
    setIsModalOpen(false);
  };

  const synonymsNode = synonyms.length ? (
    synonyms.map(({ word }) => (
      <Button key={word} type="link" onClick={() => openDialog(word)}>{word}</Button>
    ))
  ) : <NoSynonymsRecorded />;

  return (
    <>
      <WordInfoDialog
        onCancel={handleDialogCancel}
        open={isModalOpen}
        word={currentWord}
      />
      <Form.Item label="Synonyms">
        {synonymsNode}
      </Form.Item>
    </>
  );
}

export default function WordReadOnlyInfo({ createTime, modifyTime, sentences, synonyms }: {
  createTime: string
  modifyTime: string
  sentences: Sentence[]
  synonyms: Word[]
}) {

  return (
    <>
      <SynonymsNode synonyms={synonyms} />
      <SentencesItem sentences={sentences} />
      <Form.Item label="Create Time">
        <span>{createTime}</span>
      </Form.Item>
      <Form.Item label="Modify Time">
        <span>{modifyTime}</span>
      </Form.Item>
    </>
  );
}
