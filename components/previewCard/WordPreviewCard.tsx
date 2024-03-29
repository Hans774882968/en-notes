import { CardThemeClassNames, LightThemeClassNames } from '../common/contexts/CardThemeContext';
import { Word } from '@/db/models/types';
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
  word?: Word | null
  cardTheme: CardThemeClassNames
}

type PartProps = Props;

function SynonymsPart({ word, cardTheme }: PartProps) {
  const synonyms = word?.itsSynonyms;
  if (!isNonEmptyArray(synonyms)) return null;
  return (
    <>
      <h2 className={`${styles.title} ${styles[cardTheme]}`}>Synonyms</h2>
      <div className={`${styles.words} ${styles[cardTheme]}`}>
        {
          synonyms.map(({ word }) => (
            <Button key={word} className={styles.linkBtn} type="link">{word}</Button>
          ))
        }
      </div>
    </>
  );
}

function SentencePart({ word, cardTheme }: PartProps) {
  const sentences = word?.sentences;
  if (!isNonEmptyArray(sentences)) return null;
  return (
    <>
      <h2 className={`${styles.title} ${styles[cardTheme]}`}>Sentences</h2>
      <ol className={`${styles.sentences} ${styles[cardTheme]}`}>
        {
          word?.sentences.map(({ id, sentence }) => {
            return (<li key={id}><span className={styles.linkLike}>{sentence}</span></li>);
          })
        }
      </ol>
    </>
  );
}

function NotePart({ word, cardTheme }: PartProps) {
  const shouldShowTitle = isNonEmptyArray(word?.itsSynonyms) || isNonEmptyArray(word?.sentences);

  return (
    <>
      {
        shouldShowTitle && (
          <h2 className={`${styles.title} ${styles[cardTheme]}`}>Note</h2>
        )
      }
      <MarkdownPreview
        className={`${styles.markdownPreview} ${styles[cardTheme]}`}
        source={word?.note || ''}
        rehypePlugins={[rehypeSanitize]}
      />
    </>
  );
}

const WordPreviewCard = forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    const { word, cardTheme } = props;
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
          <h1 className={`${styles.title} ${styles[cardTheme]}`}>{word?.word || ''}</h1>
          <SynonymsPart {...props} />
          <SentencePart {...props} />
          <NotePart {...props} />
        </div>
      </div>
    );
  }
);

WordPreviewCard.displayName = 'WordPreviewCard';

export default WordPreviewCard;
