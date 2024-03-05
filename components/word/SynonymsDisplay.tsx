import { ReactNode } from 'react';
import { urls } from '@/lib/frontend/urls';
import Link from 'next/link';
import styles from './SynonymsDisplay.module.scss';

interface Props {
  belongWord: string
  children?: ReactNode
}

export default function SynonymsDisplay({ belongWord, children }: Props) {
  const linkHrefObj = {
    pathname: urls.word.settings,
    query: {
      word1: belongWord
    }
  };

  return (
    <div className={styles.container}>
      {
        children || (<span>No synonyms recorded yet</span>)
      }
      <div className={`${styles.linkBox} ${children ? styles.withRecord : ''}`}>
        <Link className={styles.link} href={linkHrefObj} target="_blank">Add</Link>
      </div>
    </div>
  );
}
