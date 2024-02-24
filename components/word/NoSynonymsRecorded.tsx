import { urls } from '@/lib/frontend/urls';
import Link from 'next/link';
import styles from './NoSynonymsRecorded.module.scss';

export default function NoSynonymsRecorded() {
  return (
    <div className={styles.container}>
      <span>No synonyms recorded yet</span>
      <Link href={urls.word.settings} target="_blank">Add</Link>
    </div>
  );
}
