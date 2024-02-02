import EnLayout from '@/components/EnLayout';
import styles from './index.module.scss';

export default function Home() {
  return (
    <EnLayout>
      <h1 className={styles.index}>hello en-notes</h1>
    </EnLayout>
  );
}
