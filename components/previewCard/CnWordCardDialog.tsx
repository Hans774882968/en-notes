import { CnWord } from '@/db/models/types';
import { ModalProps } from 'antd/lib/modal';
import { RefObject } from 'react';
import { useCardThemeContext } from '../common/contexts/CardThemeContext';
import CardDialog from './CardDialog';
import CnWordPreviewCard from './CnWordPreviewCard';
import Watermark from 'antd/lib/watermark';
import useGetCnWord from '@/lib/frontend/hooks/api/useGetCnWord';

interface Props {
  word: string
  externalData?: CnWord
  open: boolean
  onCancel: ModalProps['onCancel']
}

export default function CnWordCardDialog({ word, open, onCancel, externalData }: Props) {
  const { cardTheme } = useCardThemeContext();

  const title = `English Topic Card: ${word}`;

  const { cnWord: cnWordRecord } = useGetCnWord({
    dialogOpen: open,
    externalData,
    params: { word }
  });

  const getCnWordPreviewCard = (previewCardRef: RefObject<HTMLDivElement>, watermarkText: string | string[]) => {
    const cardProps = {
      cardTheme,
      note: cnWordRecord?.note || '',
      title: word
    };
    if (!watermarkText) {
      return <CnWordPreviewCard ref={previewCardRef} {...cardProps} />;
    }
    return (
      <div ref={previewCardRef}>
        <Watermark content={watermarkText}>
          <CnWordPreviewCard {...cardProps} />
        </Watermark>
      </div>
    );
  };

  return (
    <CardDialog<CnWord>
      title={title}
      open={open}
      onCancel={onCancel}
      data={cnWordRecord}
      getChildren={getCnWordPreviewCard}
    />
  );
}
