import { KeyboardEvent, useState } from 'react';
import { Sentence } from '@/db/models/types';
import { isMac, isWindows } from '@/lib/frontend/get-platform';
import Button from 'antd/lib/button';
import EnLayout from '@/components/EnLayout';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import MarkdownEditor from '@/components/MarkdownEditor';
import Message from 'antd/lib/message';
import Request from '@/lib/frontend/request';
import styles from './create.module.scss';

const formLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 19 }
};

const btnLayout = {
  wrapperCol: { offset: 3, span: 19 }
};

type CreateSentenceForm = {
  sentence: string
  note: string
};

const rules = {
  note: [{ message: 'note should not be empty', required: true }],
  sentence: [{ message: 'sentence should not be empty', required: true }]
};

type CreateSentenceRes = {
  sentence: Sentence
};

export default function Create() {
  const [createSentenceForm] = Form.useForm<CreateSentenceForm>();
  const sentenceFieldValue = Form.useWatch('sentence', createSentenceForm);
  const noteFieldValue = Form.useWatch('note', createSentenceForm);
  const initialValue = {
    note: '',
    sentence: ''
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const canNotSubmit = !sentenceFieldValue || !noteFieldValue || isSubmitting;

  const mdEditorKeyDown = (e: KeyboardEvent) => {
    if (!((isWindows() && e.ctrlKey) || (isMac() && e.metaKey)) || e.code !== 'KeyS') return;
    e.preventDefault();
    createSentenceForm.submit();
  };

  const onFinish = async (createSentenceFormData: CreateSentenceForm) => {
    if (canNotSubmit) return;

    setIsSubmitting(true);
    try {
      await Request.post<CreateSentenceRes>({
        data: createSentenceFormData,
        url: '/api/createSentence'
      });
      Message.success('Create sentence success');
    } catch (e) {
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EnLayout>
      <div className={styles.sentence}>
        <Form
          {...formLayout}
          form={createSentenceForm}
          name="createSentenceForm"
          initialValues={initialValue}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item label="Sentence" name="sentence" rules={rules.sentence}>
            <Input />
          </Form.Item>
          <Form.Item label="Note" name="note" rules={rules.note}>
            <MarkdownEditor onKeyDown={mdEditorKeyDown} />
          </Form.Item>
          <Form.Item {...btnLayout}>
            <Button
              className={styles.btn}
              type="primary"
              htmlType="submit"
              disabled={canNotSubmit}
              loading={isSubmitting}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </EnLayout>
  );
}
