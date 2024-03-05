import { ReactNode, RefObject, useRef, useState } from 'react';
import { runes } from 'runes2';
import { useCardThemeContext } from '../common/contexts/CardThemeContext';
import Button from 'antd/lib/button';
import Checkbox, { CheckboxProps } from 'antd/lib/checkbox';
import Col from 'antd/lib/col';
import Input from 'antd/lib/input';
import LoadingInContainer from '../common/LoadingInContainer';
import Modal, { ModalProps } from 'antd/lib/modal';
import Select from 'antd/lib/select';
import Spin from 'antd/lib/spin';
import TrademarkCircleOutlined from '@ant-design/icons/TrademarkCircleOutlined';
import dayjs from 'dayjs';
import saveAsImage from './saveAsImage';
import styles from './CardDialog.module.scss';
import useLocalStorageState from 'use-local-storage-state';

interface Props<T> {
  title: string
  data?: T | null
  open: boolean
  onCancel: ModalProps['onCancel']
  getChildren?: (previewCardRef: RefObject<HTMLDivElement>, watermarkText: string | string[]) => ReactNode | null | undefined
}

export default function CardDialog<T>({ title, open, onCancel, data, getChildren }: Props<T>) {
  const { cardTheme, cardThemeSearchResultOptions, handleCardThemeChange } = useCardThemeContext();

  const previewCardRef = useRef<HTMLDivElement>(null);

  const [watermarkText, setWatermarkText] = useLocalStorageState('watermarkText', {
    defaultValue: ['']
  });
  const [shouldAddTimestamp, setShouldAddTimestamp] = useLocalStorageState('watermarkTextAddTimestamp', {
    defaultValue: false
  });

  const [isSaving, setIsSaving] = useState(false);

  const getNewWatermarkText = (value: string, newShouldAddTimestamp: boolean) => {
    const nowTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const newWatermarkText = [value, ...(newShouldAddTimestamp ? [nowTime] : [])];
    return newWatermarkText;
  };

  const onCheckedChange: CheckboxProps['onChange'] = (e) => {
    const newShouldAdd = e.target.checked;
    setShouldAddTimestamp(newShouldAdd);
    const newWatermarkText = getNewWatermarkText(watermarkText[0], newShouldAdd);
    setWatermarkText(newWatermarkText);
  };

  const onWatermarkInputChange = (value: string) => {
    const newWatermarkText = getNewWatermarkText(value, shouldAddTimestamp);
    setWatermarkText(newWatermarkText);
  };

  const onSaveBtnClick = () => {
    saveAsImage({ previewCardRef, setIsSaving });
  };

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
              <div className={styles.toolbars}>
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
                <div className={styles.toolbar}>
                  <Col span={18}>
                    <Input
                      placeholder="Watermark text (leave empty to disable)"
                      prefix={<TrademarkCircleOutlined />}
                      allowClear
                      value={watermarkText[0] || ''}
                      onChange={(e) => onWatermarkInputChange(e.target.value)}
                      count={{
                        exceedFormatter: (txt, { max: mx }) => runes(txt).slice(0, mx).join(''),
                        max: 16,
                        show: true,
                        strategy: (txt) => runes(txt).length
                      }}
                    />
                  </Col>
                  <Col span={6}>
                    <Checkbox
                      checked={shouldAddTimestamp}
                      onChange={onCheckedChange}
                    >
                      Add timestamp to watermark
                    </Checkbox>
                  </Col>
                </div>
              </div>
            </Spin>
            {getChildren && getChildren(previewCardRef, watermarkText)}
          </div>
        )
      }
    </Modal>
  );
}
