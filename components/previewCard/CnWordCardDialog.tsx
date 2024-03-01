import { CnWord } from '@/db/models/types';
import { ModalProps } from 'antd/lib/modal';
import { useCardThemeContext } from '../common/contexts/CardThemeContext';
import { useRef, useState } from 'react';
import CardDialog from './CardDialog';
import CnWordPreviewCard from './CnWordPreviewCard';
import saveAsImage from './saveAsImage';
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

  const previewCardRef = useRef<HTMLDivElement>(null);

  const [isSaving, setIsSaving] = useState(false);

  const onSaveBtnClick = () => {
    saveAsImage({ previewCardRef, setIsSaving });
  };

  return (
    <CardDialog<CnWord>
      title={title}
      open={open}
      onCancel={onCancel}
      data={cnWordRecord}
      isSaving={isSaving}
      onSaveBtnClick={onSaveBtnClick}
    >
      {
        cnWordRecord && (
          <CnWordPreviewCard
            ref={previewCardRef}
            title={word}
            note={cnWordRecord.note}
            cardTheme={cardTheme}
          />
        )
      }
    </CardDialog>
  );
}
