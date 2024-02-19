import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import Tooltip from 'antd/lib/tooltip';
import styles from './SearchToolTip.module.scss';

export default function SearchToolTip() {
  const intro = 'If the keyword is an empty string, the search won\'t be performed; otherwise, the search will be performed';
  return (
    <Tooltip placement="top" title={intro}>
      <QuestionCircleOutlined className={styles.formTooltipIcon} />
    </Tooltip>
  );
}
