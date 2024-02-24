import Spin from 'antd/lib/spin';
import styles from './LoadingInContainer.module.scss';

export default function LoadingInContainer() {
  return (
    <div className={styles.container}>
      <Spin />
    </div>
  );
}
