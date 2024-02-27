import { BelongSentence, encodeSentenceInfo } from '@/lib/frontend/encDecSentenceInfo';
import { urls } from '@/lib/frontend/urls';
import Link from 'next/link';
import styles from './NoWordsRecorded.module.scss';

interface Props {
  belongSentence: BelongSentence
}

export default function NoWordsRecorded({ belongSentence }: Props) {
  const encodedSentenceInfo = encodeSentenceInfo(belongSentence);
  const linkHrefObj = {
    pathname: urls.word.settings,
    query: {
      sentence: encodedSentenceInfo
    }
  };

  return (
    <div className={styles.container}>
      <span>No words recorded yet</span>
      <Link href={linkHrefObj} target="_blank">Add</Link>
    </div>
  );
}
