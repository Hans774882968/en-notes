import { CreateSentenceResp } from '@/lib/backend/paramAndResp';
import { apiUrls } from '@/lib/backend/urls';
import { btnLayout, formLayout } from '@/lib/frontend/const';
import { ctrlSAction } from '@/lib/frontend/keydownActions';
import { useBeforeUnload } from 'react-use';
import { useState } from 'react';
import Button from 'antd/lib/button';
import EnLayout from '@/components/EnLayout';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import MarkdownEditor from '@/components/MarkdownEditor';
import Message from 'antd/lib/message';
import Request from '@/lib/frontend/request';
import Spin from 'antd/lib/spin';
import styles from './create.module.scss';

type CreateSentenceForm = {
  sentence: string
  note: string
};

// TODO: 提交后，如果在没更改的情况下按 ctrl + S 那么表单能够通过校验，不会报错，和 edit 页略有不同。懒得复制 edit 页的代码改这个 rules 了，就先这样吧
const rules = {
  note: [{ message: 'note should not be empty', required: true }],
  sentence: [{ message: 'sentence should not be empty', required: true }]
};

export default function Create() {
  const [createSentenceForm] = Form.useForm<CreateSentenceForm>();
  const sentenceFieldValue = Form.useWatch('sentence', createSentenceForm) || '';
  const noteFieldValue = Form.useWatch('note', createSentenceForm) || '';
  const initialValue = {
    note: '',
    sentence: ''
  };

  const [lastSubmittedSentence, setLastSubmittedSentence] = useState('');
  const [lastSubmittedNote, setLastSubmittedNote] = useState('');

  const isSentenceChanged = sentenceFieldValue !== lastSubmittedSentence;
  const isNoteChanged = noteFieldValue !== lastSubmittedNote;
  const isContentChanged = isSentenceChanged || isNoteChanged;
  useBeforeUnload(isContentChanged, 'Changes you have made may not be saved');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const canNotSubmit = !sentenceFieldValue || !noteFieldValue || !isContentChanged || isSubmitting;

  const editorKeyDown = ctrlSAction(() => createSentenceForm.submit());

  const onFinish = async (createSentenceFormData: CreateSentenceForm) => {
    if (canNotSubmit) return;

    setIsSubmitting(true);
    try {
      await Request.post<CreateSentenceResp>({
        data: createSentenceFormData,
        url: apiUrls.sentence.create
      });
      setLastSubmittedSentence(sentenceFieldValue);
      setLastSubmittedNote(noteFieldValue);
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
        <Spin spinning={isSubmitting}>
          <Form
            {...formLayout}
            form={createSentenceForm}
            name="createSentenceForm"
            initialValues={initialValue}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item label="Sentence" name="sentence" rules={rules.sentence}>
              <Input autoFocus onKeyDown={editorKeyDown} />
            </Form.Item>
            <Form.Item label="Note" name="note" rules={rules.note}>
              <MarkdownEditor
                onKeyDown={editorKeyDown}
                highlightBorder={isNoteChanged}
              />
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
        </Spin>
      </div>
    </EnLayout>
  );
}
