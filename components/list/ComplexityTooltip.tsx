import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import Tooltip from 'antd/lib/tooltip';
import styles from './ComplexityTooltip.module.scss';

export default function ComplexityTooltip({ title }: { title: string }) {
  return (
    <>
      Complexity
      <Tooltip
        placement="top"
        title={title}
        overlayStyle={{ maxWidth: 300 }}
      >
        <QuestionCircleOutlined className={styles.complexityTooltip} />
      </Tooltip>
    </>
  );
}
