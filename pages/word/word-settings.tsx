import EnLayout from '@/components/EnLayout';
import FormSkeleton from '@/components/word/word-settings/FormSkeleton';
import dynamic from 'next/dynamic';
import styles from './word-settings.module.scss';

const AddSynonymForm = dynamic(
  () => import('@/components/word/word-settings/AddSynonymForm'),
  { loading: () => <FormSkeleton />, ssr: false }
);
const LinkWordAndSentenceForm = dynamic(
  () => import('@/components/word/word-settings/LinkWordAndSentenceForm'),
  { loading: () => <FormSkeleton />, ssr: false }
);

export default function WordSettings() {
  return (
    <EnLayout>
      <div className={styles.wordSettings}>
        <AddSynonymForm />
        <LinkWordAndSentenceForm />
      </div>
    </EnLayout>
  );
}
