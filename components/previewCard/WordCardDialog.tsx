import { ModalProps } from 'antd/lib/modal';
import { RefObject } from 'react';
import { Word } from '@/db/models/types';
import { useCardThemeContext } from '../common/contexts/CardThemeContext';
import CardDialog from './CardDialog';
import Watermark from 'antd/lib/watermark';
import WordPreviewCard from './WordPreviewCard';
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

  const getWordPreviewCard = (previewCardRef: RefObject<HTMLDivElement>, watermarkText: string | string[]) => {
    const cardProps = {
      cardTheme,
      word: wordRecord
    };
    if (!watermarkText) {
      return <WordPreviewCard ref={previewCardRef} {...cardProps} />;
    }
    return (
      <div ref={previewCardRef}>
        <Watermark content={watermarkText}>
          <WordPreviewCard {...cardProps} />
        </Watermark>
      </div>
    );
  };

  return (
    <CardDialog<Word>
      title={title}
      open={open}
      onCancel={onCancel}
      data={wordRecord}
      getChildren={getWordPreviewCard}
    />
  );
}
