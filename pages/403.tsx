import EnLayout from '@/components/EnLayout';
import styles from './403.module.scss';

export default function Forbidden() {
  return (
    <EnLayout>
      <h1 className={styles.index}>403 Forbidden</h1>
    </EnLayout>
  );
}
