import { urls } from '@/lib/frontend/urls';
import Link from 'next/link';
import styles from './NoSentencesRecorded.module.scss';

export default function NoSentencesRecorded() {
  return (
    <div className={styles.container}>
      <span>No sentences recorded yet</span>
      <Link href={urls.word.settings} target="_blank">Add</Link>
    </div>
  );
}
