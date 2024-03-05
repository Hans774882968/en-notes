import { ModalProps } from 'antd/lib/modal';
import { RefObject } from 'react';
import { Sentence, SentenceIdType } from '@/db/models/types';
import { useCardThemeContext } from '../common/contexts/CardThemeContext';
import CardDialog from './CardDialog';
import SentencePreviewCard from './SentencePreviewCard';
import Watermark from 'antd/lib/watermark';
import useGetSentence from '@/lib/frontend/hooks/api/useGetSentence';

interface Props {
  sentenceId: SentenceIdType
  sentence: string
  externalData?: Sentence
  open: boolean
  onCancel: ModalProps['onCancel']
}

export default function SentenceCardDialog({ sentenceId, sentence, open, onCancel, externalData }: Props) {
  const { cardTheme } = useCardThemeContext();

  const title = `Sentence Card: ${sentence}`;

  const { sentence: sentenceRecord } = useGetSentence({
    dialogOpen: open,
    externalData,
    params: { sentence: sentenceId }
  });

  const getSentencePreviewCard = (previewCardRef: RefObject<HTMLDivElement>, watermarkText: string | string[]) => {
    const cardProps = {
      cardTheme,
      sentence: sentenceRecord
    };
    if (!watermarkText) {
      return <SentencePreviewCard ref={previewCardRef} {...cardProps} />;
    }
    return (
      <div ref={previewCardRef}>
        <Watermark content={watermarkText}>
          <SentencePreviewCard {...cardProps} />
        </Watermark>
      </div>
    );
  };

  return (
    <CardDialog<Sentence>
      title={title}
      open={open}
      onCancel={onCancel}
      data={sentenceRecord}
      getChildren={getSentencePreviewCard}
    />
  );
}
