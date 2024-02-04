import { useState } from 'react';
import Button from 'antd/lib/button';
import EnLayout from '@/components/EnLayout';
import Form from 'antd/lib/form';
import Request from '@/lib/frontend/request';
import Switch from 'antd/lib/switch';
import styles from './export.module.scss';

type ExportForm = {
  junctionTables: boolean
  separate: boolean
};

const exportFormLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
};

const exportBtnLayout = {
  wrapperCol: { offset: 6, span: 16 }
};

export default function Export() {
  const [exportForm] = Form.useForm<ExportForm>();
  const initialValue: ExportForm = {
    junctionTables: true,
    separate: false
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = async (exportFormOptions: ExportForm) => {
    const params = {
      junctionTables: exportFormOptions.junctionTables ? '1' : '',
      separate: exportFormOptions.separate ? '1' : ''
    };
    setIsSubmitting(true);
    try {
      await Request.downloadGet({ params, url: '/api/export' });
    } catch (e) {
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EnLayout>
      <div className={styles.export}>
        <Form
          {...exportFormLayout}
          form={exportForm}
          name="exportForm"
          initialValues={initialValue}
          onFinish={onFinish}
        >
          <Form.Item label="Contains Junction Info" name="junctionTables">
            <Switch />
          </Form.Item>
          <Form.Item label="Separate" name="separate">
            <Switch />
          </Form.Item>
          <Form.Item {...exportBtnLayout}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
            >
              Export
            </Button>
          </Form.Item>
        </Form>
      </div>
    </EnLayout>
  );
}
