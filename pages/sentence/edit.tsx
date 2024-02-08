import { DEBOUNCE_DEFAULT_OPTION, DEBOUNCE_DEFAULT_TIMEOUT } from '@/lib/const';
import { GetSentenceResp, SentenceSearchResp, UpdateSentenceResp } from '@/lib/backend/paramAndResp';
import { Sentence } from '@/db/models/types';
import { ctrlSAction } from '@/lib/frontend/keydownActions';
import { useDebouncedCallback } from 'use-debounce';
import { useState } from 'react';
import Button from 'antd/lib/button';
import EnLayout from '@/components/EnLayout';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import MarkdownEditor from '@/components/MarkdownEditor';
import Message from 'antd/lib/message';
import Request from '@/lib/frontend/request';
import Select from 'antd/lib/select';
import styles from './edit.module.scss';

const formLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 19 }
};

const btnLayout = {
  wrapperCol: { offset: 3, span: 19 }
};

type EditSentenceForm = {
  sentence: string
  note: string
};

const rules = {
  note: [{ message: 'note should not be empty', required: true }],
  sentence: [{ message: 'sentence should not be empty', required: true }]
};

function SentenceReadOnlyInfo({ createTime, modifyTime, wordsText }: {
  createTime: string
  modifyTime: string
  wordsText: string
}) {
  return (
    <>
      <Form.Item label="Relevant Words">
        <span>{wordsText || 'No words recorded yet'}</span>
      </Form.Item>
      <Form.Item label="Create Time">
        <span>{createTime}</span>
      </Form.Item>
      <Form.Item label="Modify Time">
        <span>{modifyTime}</span>
      </Form.Item>
    </>
  );
}

export default function Edit() {
  const [editSentenceForm] = Form.useForm<EditSentenceForm>();
  const noteFieldValue = Form.useWatch('note', editSentenceForm);
  const initialValue = {
    note: '',
    sentence: ''
  };

  const [wordsText, setWordsText] = useState('');
  const [createTime, setCreateTime] = useState('');
  const [modifyTime, setModifyTime] = useState('');

  const [sentenceId, setSentenceId] = useState('');
  const [searchResult, setSearchResult] = useState<Sentence[]>([]);
  const searchResultOptions = searchResult.map((st) => ({ label: st.sentence, value: st.id }));

  const [sentenceFetched, setSentenceFetched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canNotSubmit = !sentenceFetched || isSubmitting;

  const handleSentenceChange = (newSentenceId: string) => {
    setSentenceId(newSentenceId);
  };

  const handleSentenceSearch = useDebouncedCallback(
    async (newSentence: string) => {
      try {
        const { result } = await Request.get<SentenceSearchResp>({ params: { search: newSentence }, url: '/api/sentence/search' });
        setSearchResult(result);
      } catch (e) {
        return;
      }
    },
    DEBOUNCE_DEFAULT_TIMEOUT,
    DEBOUNCE_DEFAULT_OPTION
  );

  const getSentence = async () => {
    let sentence: Sentence | null = null;
    setSentenceFetched(false);
    if (!sentenceId) return;
    try {
      const getSentenceRes = await Request.get<GetSentenceResp>({ params: { sentence: sentenceId }, url: '/api/getSentence' });
      sentence = getSentenceRes.sentence;
    } catch (e) {
      Message.error({ content: 'get sentence info failed' });
      return;
    }
    if (!sentence) {
      return;
    }
    setSentenceFetched(true);
    setWordsText(sentence.words.map(({ word }) => word).join('; '));
    setCreateTime(sentence.ctime);
    setModifyTime(sentence.mtime);
    editSentenceForm.setFieldValue('sentence', sentence.sentence);
    editSentenceForm.setFieldValue('note', sentence.note);
  };

  const mdEditorKeyDown = ctrlSAction(() => editSentenceForm.submit());

  // const getSearchResultAfterFinish = (editSentenceData: EditSentenceForm) => {
  //   const idx = searchResult.findIndex((s) => s.id === sentenceId);
  //   if (idx !== 1) {
  //     return searchResult;
  //   }
  //   const item = searchResult[idx];
  //   const modifiedIncompleteSentence = {
  //     ...item,
  //     ...editSentenceData
  //   };
  //   const res = [...searchResult.slice(0, idx), modifiedIncompleteSentence, ...searchResult.slice(idx + 1)];
  //   return res;
  // };

  const onFinish = async (editSentenceData: EditSentenceForm) => {
    if (canNotSubmit) return;

    const params = { ...editSentenceData, id: sentenceId };
    setIsSubmitting(true);
    try {
      await Request.post<UpdateSentenceResp>({
        data: params,
        url: '/api/updateSentence'
      });
      Message.success('Update sentence success');
    } catch (e) {
      return;
    } finally {
      setIsSubmitting(false);
    }
    getSentence();
    // TODO: 希望在修改成功后刷新下拉框组件显示的label和选项，后者OK但前者不奏效
    // setSearchResult(() => getSearchResultAfterFinish(editSentenceData));
  };

  const cleanNote = () => {
    const cleanedNote = noteFieldValue.trim().replace(/  +/g, ' ');
    editSentenceForm.setFieldValue('note', cleanedNote);
  };

  return (
    <EnLayout>
      <div className={styles.sentence}>
        <Form
          {...formLayout}
          form={editSentenceForm}
          name="editSentenceForm"
          initialValues={initialValue}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item label="Search">
            <Select
              autoFocus
              placeholder="Search sentence"
              options={searchResultOptions}
              onChange={handleSentenceChange}
              onSearch={handleSentenceSearch}
              onBlur={getSentence}
              showSearch
              filterOption={false}
            />
          </Form.Item>
          {
            sentenceFetched && (
              <>
                <SentenceReadOnlyInfo
                  createTime={createTime}
                  modifyTime={modifyTime}
                  wordsText={wordsText}
                />
                <Form.Item label="Sentence" name="sentence" rules={rules.sentence}>
                  <Input />
                </Form.Item>
                <Form.Item label="Note" name="note" rules={rules.note}>
                  <MarkdownEditor onKeyDown={mdEditorKeyDown} />
                </Form.Item>
              </>
            )
          }
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
            {
              sentenceFetched && (
                <Button className={styles.btn} onClick={cleanNote}>
                  Clean Note
                </Button>
              )
            }
          </Form.Item>
        </Form>
      </div>
    </EnLayout>
  );
}
