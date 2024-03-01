import { ReactNode } from 'react';
import { useCardThemeContext } from '../common/contexts/CardThemeContext';
import Button from 'antd/lib/button';
import LoadingInContainer from '../common/LoadingInContainer';
import Modal, { ModalProps } from 'antd/lib/modal';
import Select from 'antd/lib/select';
import Spin from 'antd/lib/spin';
import styles from './CardDialog.module.scss';

interface Props<T> {
  title: string
  data?: T | null
  open: boolean
  onCancel: ModalProps['onCancel']
  isSaving?: boolean
  onSaveBtnClick: () => void | Promise<void>
  children?: ReactNode
}

export default function CardDialog<T>({ title, open, onCancel, isSaving, data, children, onSaveBtnClick }: Props<T>) {
  const { cardTheme, cardThemeSearchResultOptions, handleCardThemeChange } = useCardThemeContext();

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      width={1200}
      footer={[]}
    >
      {
        !data ? <LoadingInContainer /> : (
          <div className={styles.container}>
            <Spin spinning={isSaving}>
              <div className={styles.toolbar}>
                <Select
                  style={{ width: 150 }}
                  disabled={isSaving}
                  options={cardThemeSearchResultOptions}
                  onChange={handleCardThemeChange}
                  showSearch
                  value={cardTheme}
                />
                <Button
                  type="primary"
                  disabled={isSaving}
                  loading={isSaving}
                  onClick={onSaveBtnClick}
                >
                  Save As Image
                </Button>
              </div>
            </Spin>
            {children}
          </div>
        )
      }
    </Modal>
  );
}
