import { urls } from '@/lib/frontend/urls';
import Link from 'next/link';
import styles from './NoSynonymsRecorded.module.scss';

interface Props {
  belongWord: string
}

export default function NoSynonymsRecorded({ belongWord }: Props) {
  const linkHrefObj = {
    pathname: urls.word.settings,
    query: {
      word1: belongWord
    }
  };

  return (
    <div className={styles.container}>
      <span>No synonyms recorded yet</span>
      <Link href={linkHrefObj} target="_blank">Add</Link>
    </div>
  );
}
