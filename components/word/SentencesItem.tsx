import { Sentence } from '@/db/models/types';
import { useState } from 'react';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import SentenceInfoDialog from './SentenceInfoDialog';

export default function SentencesItem({ sentences }: { sentences: Sentence[] }) {
  const [currentSentenceId, setCurrentSentenceId] = useState('');
  const [currentSentence, setCurrentSentence] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDialog = (sentenceId: string, sentence: string) => {
    setCurrentSentenceId(sentenceId);
    setCurrentSentence(sentence);
    setIsModalOpen(true);
  };

  const handleDialogCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <SentenceInfoDialog
        onCancel={handleDialogCancel}
        open={isModalOpen}
        sentence={currentSentence}
        sentenceId={currentSentenceId}
      />
      <Form.Item label="Sentences">
        {
          !sentences.length ? <span>No sentences recorded yet</span> : (
            <ol>
              {
                sentences.map(({ id: sentenceId, sentence }) => {
                  return (
                    <Button
                      key={sentenceId}
                      type="link"
                      onClick={() => openDialog(sentenceId, sentence)}
                    >
                      {sentence}
                    </Button>
                  );
                })
              }
            </ol>
          )
        }
      </Form.Item>
    </>
  );
}
