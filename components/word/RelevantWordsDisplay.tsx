import { BelongSentence, encodeSentenceInfo } from '@/lib/frontend/encDecSentenceInfo';
import { ReactNode } from 'react';
import { urls } from '@/lib/frontend/urls';
import Link from 'next/link';
import styles from './RelevantWordsDisplay.module.scss';

interface Props {
  belongSentence: BelongSentence
  children?: ReactNode
}

export default function RelevantWordsDisplay({ belongSentence, children }: Props) {
  const encodedSentenceInfo = encodeSentenceInfo(belongSentence);
  const linkHrefObj = {
    pathname: urls.word.settings,
    query: {
      sentence: encodedSentenceInfo
    }
  };

  return (
    <div className={styles.container}>
      {
        children || (<span>No words recorded yet</span>)
      }
      <div className={`${styles.linkBox} ${children ? styles.withRecord : ''}`}>
        <Link className={styles.link} href={linkHrefObj} target="_blank">Add</Link>
      </div>
    </div>
  );
}
