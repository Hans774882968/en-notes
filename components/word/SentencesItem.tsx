import { Sentence, SentenceIdType } from '@/db/models/types';
import { useState } from 'react';
import Form from 'antd/lib/form';
import SentenceInfoDialog from './SentenceInfoDialog';
import SentencesDisplay from './SentencesDisplay';
import styles from './SentencesItem.module.scss';

interface Props {
  sentences: Sentence[]
  belongWord: string
}

export default function SentencesItem({ belongWord, sentences }: Props) {
  const [currentSentenceId, setCurrentSentenceId] = useState<SentenceIdType>('');
  const [currentSentence, setCurrentSentence] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDialog = (sentenceId: SentenceIdType, sentence: string) => {
    setCurrentSentenceId(sentenceId);
    setCurrentSentence(sentence);
    setIsModalOpen(true);
  };

  const handleDialogCancel = () => {
    setIsModalOpen(false);
  };

  const sentencesChildren = !sentences.length ? null : (
    <ol className={styles.ol}>
      {
        sentences.map(({ id: sentenceId, sentence }) => {
          return (
            <li key={sentenceId}>
              <span className={styles.linkLike} onClick={() => openDialog(sentenceId, sentence)}>
                {sentence}
              </span>
            </li>
          );
        })
      }
    </ol>
  );

  return (
    <>
      <SentenceInfoDialog
        onCancel={handleDialogCancel}
        open={isModalOpen}
        sentence={currentSentence}
        sentenceId={currentSentenceId}
      />
      <Form.Item label="Sentences">
        <SentencesDisplay belongWord={belongWord}>
          {sentencesChildren}
        </SentencesDisplay>
      </Form.Item>
    </>
  );
}
