import { ModalProps } from 'antd/lib/modal';
import { Word } from '@/db/models/types';
import { useCardThemeContext } from '../common/contexts/CardThemeContext';
import { useRef, useState } from 'react';
import CardDialog from './CardDialog';
import WordPreviewCard from './WordPreviewCard';
import saveAsImage from './saveAsImage';
import useGetWord from '@/lib/frontend/hooks/api/useGetWord';

interface Props {
  word: string
  externalData?: Word
  open: boolean
  onCancel: ModalProps['onCancel']
}

export default function WordCardDialog({ word, open, onCancel, externalData }: Props) {
  const { cardTheme } = useCardThemeContext();

  const title = `Word Card: ${word}`;

  const { word: wordRecord } = useGetWord({
    dialogOpen: open,
    externalData,
    params: { word }
  });

  const previewCardRef = useRef<HTMLDivElement>(null);

  const [isSaving, setIsSaving] = useState(false);

  const onSaveBtnClick = () => {
    saveAsImage({ previewCardRef, setIsSaving });
  };

  return (
    <CardDialog<Word>
      title={title}
      open={open}
      onCancel={onCancel}
      data={wordRecord}
      isSaving={isSaving}
      onSaveBtnClick={onSaveBtnClick}
    >
      {
        wordRecord && (
          <WordPreviewCard
            ref={previewCardRef}
            word={word}
            note={wordRecord.note}
            cardTheme={cardTheme}
          />
        )
      }
    </CardDialog>
  );
}
