import { urls } from '@/lib/frontend/urls';
import Link from 'next/link';
import styles from './NoSentencesRecorded.module.scss';

interface Props {
  belongWord: string
}

export default function NoSentencesRecorded({ belongWord }: Props) {
  const linkHrefObject = {
    pathname: urls.word.settings,
    query: {
      word: belongWord
    }
  };

  return (
    <div className={styles.container}>
      <span>No sentences recorded yet</span>
      <Link href={linkHrefObject} target="_blank">Add</Link>
    </div>
  );
}
