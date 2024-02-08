import { CreateSentenceResp } from '@/lib/backend/paramAndResp';
import { ctrlSAction } from '@/lib/frontend/keydownActions';
import { useState } from 'react';
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

  const mdEditorKeyDown = ctrlSAction(() => createSentenceForm.submit());

  const onFinish = async (createSentenceFormData: CreateSentenceForm) => {
    if (canNotSubmit) return;

    setIsSubmitting(true);
    try {
      await Request.post<CreateSentenceResp>({
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

  const cleanNote = () => {
    const cleanedNote = noteFieldValue.trim().replace(/  +/g, ' ');
    createSentenceForm.setFieldValue('note', cleanedNote);
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
            <Button className={styles.btn} onClick={cleanNote}>
              Clean Note
            </Button>
          </Form.Item>
        </Form>
      </div>
    </EnLayout>
  );
}
