import { urls } from '@/lib/frontend/urls';
import Link from 'next/link';
import styles from './NoWordsRecorded.module.scss';

export default function NoWordsRecorded() {
  return (
    <div className={styles.container}>
      <span>No words recorded yet</span>
      <Link href={urls.word.settings} target="_blank">Add</Link>
    </div>
  );
}
