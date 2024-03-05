import { ReactNode } from 'react';
import { urls } from '@/lib/frontend/urls';
import Link from 'next/link';
import styles from './SentencesDisplay.module.scss';

interface Props {
  belongWord: string
  children?: ReactNode
}

export default function SentencesDisplay({ belongWord, children }: Props) {
  const linkHrefObject = {
    pathname: urls.word.settings,
    query: {
      word: belongWord
    }
  };

  if (!children) {
    return (
      <div className={styles.noRecordContainer}>
        <span>No sentences recorded yet</span>
        <Link className={styles.link} href={linkHrefObject} target="_blank">Add</Link>
      </div>
    );
  }

  return (
    <div className={styles.hasRecordContainer}>
      {children}
      <div className={styles.linkBox}>
        <Link className={styles.link} href={linkHrefObject} target="_blank">Add</Link>
      </div>
    </div>
  );
}
