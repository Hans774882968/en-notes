import { Sentence, Word } from '@/db/models/types';
import { useState } from 'react';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import NoSynonymsRecorded from './NoSynonymsRecorded';
import SentencesItem from './SentencesItem';
import WordInfoDialog from './WordInfoDialog';

interface SynonymsNodeProps {
  belongWord: string
  synonyms: Word[]
}

function SynonymsNode({ belongWord, synonyms }: SynonymsNodeProps) {
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
  ) : <NoSynonymsRecorded belongWord={belongWord} />;

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

interface WordReadOnlyInfoProps {
  belongWord: string
  createTime: string
  modifyTime: string
  sentences: Sentence[]
  synonyms: Word[]
}

export default function WordReadOnlyInfo({
  belongWord,
  createTime,
  modifyTime,
  sentences,
  synonyms
}: WordReadOnlyInfoProps) {
  return (
    <>
      <SynonymsNode belongWord={belongWord} synonyms={synonyms} />
      <SentencesItem belongWord={belongWord} sentences={sentences} />
      <Form.Item label="Create Time">
        <span>{createTime}</span>
      </Form.Item>
      <Form.Item label="Modify Time">
        <span>{modifyTime}</span>
      </Form.Item>
    </>
  );
}
