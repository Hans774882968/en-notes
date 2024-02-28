// import MarkdownPreview from '@uiw/react-markdown-preview';
import { MdEditorThemeName, useThemeContext } from '../ThemeContext';
import { RefObject, forwardRef, useImperativeHandle, useRef } from 'react';
import dynamic from 'next/dynamic';
import rehypeSanitize from 'rehype-sanitize';
import styles from './WordPreviewCard.module.scss';

const MarkdownPreview = dynamic(
  () => import('@uiw/react-markdown-preview'),
  { ssr: false }
);

// reference https://github.com/nicejade/markdown2png/blob/master/src/views/Home.vue
// TODO: 纸屑样式的纸屑 svg 没有出现在导出图像里，奇怪的是商务样式又正常。原作者也没解决，不得不感慨 html2canvas 真的乐色。只好先搁置了

export enum DarkThemeClassNames {
  DARK = 'dark' // 暗黑
}

export enum LightThemeClassNames {
  NOTE = 'note', // 便签
  ANTIQUITY = 'antiquity', // 古风
  BBBURST = 'bbburst', // 纸屑
  CLASSIC = 'classic', // 经典
  VITALITY = 'vitality', // 元气
  GRADIENT = 'gradient', // 渐变
  OFFICIAL = 'official', // 商务
  YELLOW = 'yellow' // 芒黄
}

export type CardThemeClassNames = DarkThemeClassNames | LightThemeClassNames

interface CardThemeOption {
  label: string
  value: CardThemeClassNames
}

export const CARD_THEME_LISTS: Record<MdEditorThemeName, Array<CardThemeOption>> = {
  dark: [
    { label: 'Dark', value: DarkThemeClassNames.DARK }
  ],
  light: [
    { label: 'Note', value: LightThemeClassNames.NOTE },
    { label: 'Antiquity', value: LightThemeClassNames.ANTIQUITY },
    { label: 'BBBurst', value: LightThemeClassNames.BBBURST },
    { label: 'Classic', value: LightThemeClassNames.CLASSIC },
    { label: 'Vitality', value: LightThemeClassNames.VITALITY },
    { label: 'Gradient', value: LightThemeClassNames.GRADIENT },
    { label: 'Official', value: LightThemeClassNames.OFFICIAL },
    { label: 'Yellow', value: LightThemeClassNames.YELLOW }
  ]
};

export interface WordPreviewCardRef {
  containerRef: RefObject<HTMLDivElement>
}

interface Props {
  word: string
  note: string
  cardTheme: CardThemeClassNames
}

const WordPreviewCard = forwardRef<WordPreviewCardRef, Props>(
  ({ word, note, cardTheme }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      containerRef
    }));

    return (
      <div
        ref={containerRef}
        className={`${styles.container} ${styles[cardTheme]}`}
      >
        {
          cardTheme === LightThemeClassNames.OFFICIAL && (
            <div className={styles.officialBg}></div>
          )
        }
        <div className={`${styles.inner} ${styles[cardTheme]}`}>
          <h1 className={`${styles.title} ${styles[cardTheme]}`}>{word}</h1>
          <MarkdownPreview
            className={`${styles.markdownPreview} ${styles[cardTheme]}`}
            source={note}
            rehypePlugins={[rehypeSanitize]}
          />
        </div>
      </div>
    );
  }
);

WordPreviewCard.displayName = 'WordPreviewCard';

export default WordPreviewCard;
