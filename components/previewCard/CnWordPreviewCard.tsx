import { CardThemeClassNames, LightThemeClassNames } from '../common/contexts/CardThemeContext';
import { forwardRef } from 'react';
import Skeleton from 'antd/lib/skeleton';
import dynamic from 'next/dynamic';
import rehypeSanitize from 'rehype-sanitize';
import styles from './PreviewCard.module.scss';

const MarkdownPreview = dynamic(
  () => import('@uiw/react-markdown-preview'),
  { loading: () => <Skeleton paragraph={{ rows: 5 }} active />, ssr: false }
);

interface Props {
  title: string
  note: string
  cardTheme: CardThemeClassNames
}

const CnWordPreviewCard = forwardRef<HTMLDivElement, Props>(
  ({ title, note, cardTheme }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.container} ${styles[cardTheme]}`}
      >
        {
          cardTheme === LightThemeClassNames.OFFICIAL && (
            <div className={styles.officialBg}></div>
          )
        }
        <div className={`${styles.inner} ${styles[cardTheme]}`}>
          <h1 className={`${styles.title} ${styles[cardTheme]}`}>{title}</h1>
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

CnWordPreviewCard.displayName = 'CnWordPreviewCard';

export default CnWordPreviewCard;
