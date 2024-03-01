import Spin, { SpinProps } from 'antd/lib/spin';
import styles from './LoadingInContainer.module.scss';

type Props = SpinProps;

export default function LoadingInContainer(props: Props) {
  return (
    <div className={styles.container}>
      <Spin {...props} />
    </div>
  );
}
