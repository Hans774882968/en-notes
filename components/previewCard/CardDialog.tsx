import { Word } from '@/db/models/types';
import { useRef, useState } from 'react';
import { useThemeContext } from '../ThemeContext';
import Button from 'antd/lib/button';
import LoadingInContainer from '../common/LoadingInContainer';
import Modal, { ModalProps } from 'antd/lib/modal';
import Select from 'antd/lib/select';
import Spin from 'antd/lib/spin';
import WordPreviewCard, { CARD_THEME_LISTS, CardThemeClassNames, WordPreviewCardRef } from './WordPreviewCard';
import errorGeneralHelper from '@/lib/frontend/errorGeneralHelper';
import genFileNameAtFrontend from '@/lib/frontend/genFileNameAtFrontend';
import html2canvas from 'html2canvas';
import styles from './CardDialog.module.scss';
import useGetWord from '@/lib/frontend/hooks/api/useGetWord';

interface Props {
  word: string
  externalData?: Word
  open: boolean
  onCancel: ModalProps['onCancel']
}

function download2png(canvas: HTMLCanvasElement) {
  const tempDomNode = document.createElement('a');
  tempDomNode.href = canvas.toDataURL('image/png');
  tempDomNode.download = genFileNameAtFrontend() + '.png';
  tempDomNode.click();
}

export default function CardDialog({ word, open, onCancel, externalData }: Props) {
  const { mdEditorThemeName } = useThemeContext();
  const [lastMdEditorThemeName, setLastMdEditorThemeName] = useState(mdEditorThemeName);
  const cardThemeSearchResultOptions = CARD_THEME_LISTS[mdEditorThemeName];

  const { word: wordRecord } = useGetWord({
    dialogOpen: open,
    externalData,
    params: { word }
  });

  const getInitialCardTheme = () => cardThemeSearchResultOptions[0].value;
  const [cardTheme, setCardTheme] = useState(getInitialCardTheme);
  if (mdEditorThemeName !== lastMdEditorThemeName) {
    setLastMdEditorThemeName(mdEditorThemeName);
    setCardTheme(getInitialCardTheme());
  }

  const wordPreviewCardRef = useRef<WordPreviewCardRef>(null);

  const [isSaving, setIsSaving] = useState(false);

  const handleCardThemeChange = (newCardTheme: CardThemeClassNames) => {
    setCardTheme(newCardTheme);
  };

  const saveAsImage = async () => {
    setIsSaving(true);
    try {
      if (!wordPreviewCardRef.current || !wordPreviewCardRef.current.containerRef.current) return;
      const canvas = await html2canvas(wordPreviewCardRef.current.containerRef.current);
      download2png(canvas);
    } catch (err) {
      errorGeneralHelper(err, 'html2canvas unknown error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      title={word}
      open={open}
      onCancel={onCancel}
      width={1200}
      footer={[]}
    >
      {
        !wordRecord ? <LoadingInContainer /> : (
          <div className={styles.container}>
            <Spin spinning={isSaving}>
              <div className={styles.toolbar}>
                <Select
                  style={{ width: 150 }}
                  disabled={isSaving}
                  options={cardThemeSearchResultOptions}
                  onChange={handleCardThemeChange}
                  showSearch
                  value={cardTheme}
                />
                <Button
                  type="primary"
                  disabled={isSaving}
                  loading={isSaving}
                  onClick={saveAsImage}
                >
                  Save As Image
                </Button>
              </div>
            </Spin>
            <WordPreviewCard
              ref={wordPreviewCardRef}
              word={word}
              note={wordRecord?.note}
              cardTheme={cardTheme}
            />
          </div>
        )
      }
    </Modal>
  );
}
