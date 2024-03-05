import { CardThemeClassNames, LightThemeClassNames } from '../common/contexts/CardThemeContext';
import { Sentence } from '@/db/models/types';
import { forwardRef } from 'react';
import { isNonEmptyArray } from '@/lib/utils';
import Button from 'antd/lib/button';
import Skeleton from 'antd/lib/skeleton';
import dynamic from 'next/dynamic';
import rehypeSanitize from 'rehype-sanitize';
import styles from './PreviewCard.module.scss';

const MarkdownPreview = dynamic(
  () => import('@uiw/react-markdown-preview'),
  { loading: () => <Skeleton paragraph={{ rows: 5 }} active />, ssr: false }
);

interface Props {
  sentence?: Sentence | null
  cardTheme: CardThemeClassNames
}

type PartProps = Props;

function RelevantWordsPart({ sentence, cardTheme }: PartProps) {
  const words = sentence?.words;
  if (!isNonEmptyArray(words)) return null;
  return (
    <>
      <h2 className={`${styles.title} ${styles[cardTheme]}`}>Relevant Words</h2>
      <div className={`${styles.words} ${styles[cardTheme]}`}>
        {
          words.map(({ word }) => (
            <Button key={word} className={styles.linkBtn} type="link">{word}</Button>
          ))
        }
      </div>
    </>
  );
}

function NotePart({ sentence, cardTheme }: PartProps) {
  const shouldShowTitle = isNonEmptyArray(sentence?.words);

  return (
    <>
      {
        shouldShowTitle && (
          <h2 className={`${styles.title} ${styles[cardTheme]}`}>Note</h2>
        )
      }
      <MarkdownPreview
        className={`${styles.markdownPreview} ${styles[cardTheme]}`}
        source={sentence?.note || ''}
        rehypePlugins={[rehypeSanitize]}
      />
    </>
  );
}

const SentencePreviewCard = forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    const { sentence, cardTheme } = props;
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
          <h1 className={`${styles.title} ${styles[cardTheme]}`}>{sentence?.sentence || ''}</h1>
          <RelevantWordsPart {...props} />
          <NotePart {...props} />
        </div>
      </div>
    );
  }
);

SentencePreviewCard.displayName = 'SentencePreviewCard';

export default SentencePreviewCard;
