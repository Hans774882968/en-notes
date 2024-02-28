import { BelongSentence } from '@/lib/frontend/encDecSentenceInfo';
import { DEBOUNCE_DEFAULT_OPTION, DEBOUNCE_DEFAULT_TIMEOUT, btnLayout, formLayout } from '@/lib/frontend/const';
import { GetSentenceResp, SentenceSearchResp, UpdateSentenceResp } from '@/lib/backend/paramAndResp';
import { Sentence, SentenceIdType, Word } from '@/db/models/types';
import { ctrlSAction } from '@/lib/frontend/keydownActions';
import { useBeforeUnload } from 'react-use';
import { useDebouncedCallback } from 'use-debounce';
import { useState } from 'react';
import Button from 'antd/lib/button';
import EditPageSkeleton from '@/components/EditPageSkeleton';
import EnLayout from '@/components/EnLayout';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import LoadingInContainer from '@/components/common/LoadingInContainer';
import MarkdownEditor from '@/components/MarkdownEditor';
import Message from 'antd/lib/message';
import RelevantWordsNode from '@/components/word/RelevantWordsNode';
import Request from '@/lib/frontend/request';
import SearchToolTip from '@/components/SearchToolTip';
import Select from 'antd/lib/select';
import Spin from 'antd/lib/spin';
import styles from './edit.module.scss';
import useCreateUpdateStateMachine from '@/lib/frontend/hooks/useCreateUpdateStateMachine';

type EditSentenceForm = {
  sentence: string
  note: string
};

interface SentenceReadOnlyInfoProps {
  createTime: string
  modifyTime: string
  words: Word[]
  belongSentence: {
    id: SentenceIdType
    text: string
  }
}

function SentenceReadOnlyInfo({ createTime, modifyTime, words, belongSentence }: SentenceReadOnlyInfoProps) {
  return (
    <>
      <RelevantWordsNode belongSentence={belongSentence} words={words} />
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
  const {
    isUpdateState,
    isFetchRecordState,
    changeToSearchState,
    changeToUpdateState,
    changeToFetchRecordState
  } = useCreateUpdateStateMachine();

  const [editSentenceForm] = Form.useForm<EditSentenceForm>();
  const sentenceFieldValue = Form.useWatch('sentence', editSentenceForm) || '';
  const noteFieldValue = Form.useWatch('note', editSentenceForm) || '';
  const initialValue = {
    note: '',
    sentence: ''
  };

  const [relevantWords, setRelevantWords] = useState<Word[]>([]);
  const [createTime, setCreateTime] = useState('');
  const [modifyTime, setModifyTime] = useState('');
  const [belongSentence, setBelongSentence] = useState<BelongSentence>({ id: '', text: '' });

  const [sentenceId, setSentenceId] = useState('');

  const [isFetchingOptions, setIsFetchingOptions] = useState(false);
  const [searchResult, setSearchResult] = useState<Sentence[]>([]);
  const searchResultOptions = searchResult.map((st) => ({ label: st.sentence, value: st.id }));

  const [originalSentence, setOriginalSentence] = useState('');
  const [originalNote, setOriginalNote] = useState('');

  // TODO: 点击菜单切换 URL 时也要拦截
  const isSentenceChanged = sentenceFieldValue !== originalSentence;
  const isNoteChanged = noteFieldValue !== originalNote;
  const isContentChanged = isSentenceChanged || isNoteChanged;
  useBeforeUnload(isContentChanged, 'Changes you have made may not be saved');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const canNotSubmit = !isUpdateState() || !sentenceFieldValue || !noteFieldValue || !isContentChanged || isSubmitting;

  const rules = {
    note: [
      { message: 'note should not be empty', required: true },
      {
        validator: (_: object, value: string) => {
          if (originalSentence === sentenceFieldValue && originalNote === value) {
            return Promise.reject(new Error('sentence or note should be modified'));
          }
          return Promise.resolve();
        }
      }
    ],
    sentence: [
      { message: 'sentence should not be empty', required: true }
    ]
  };

  const handleSentenceChange = (newSentenceId: string) => {
    setSentenceId(newSentenceId);
  };

  const handleSentenceSearch = useDebouncedCallback(
    async (newSentence: string) => {
      if (!newSentence) {
        setSearchResult([]);
        changeToSearchState();
        return;
      }
      setIsFetchingOptions(true);
      try {
        const { result } = await Request.get<SentenceSearchResp>({ params: { search: newSentence }, url: '/api/sentence/search' });
        setSearchResult(result);
      } catch (e) {
        return;
      } finally {
        setIsFetchingOptions(false);
      }
    },
    DEBOUNCE_DEFAULT_TIMEOUT,
    DEBOUNCE_DEFAULT_OPTION
  );

  const getSentence = async () => {
    let sentence: Sentence | null = null;
    changeToFetchRecordState();
    if (!sentenceId) {
      changeToSearchState();
      return;
    }
    try {
      const getSentenceRes = await Request.get<GetSentenceResp>({ params: { sentence: sentenceId }, url: '/api/getSentence' });
      sentence = getSentenceRes.sentence;
    } catch (e) {
      Message.error({ content: 'get sentence info failed' });
      changeToSearchState();
      return;
    }
    if (!sentence) {
      // 只要不去数据库快速删除记录，理论上就不会走到这里
      setOriginalSentence('');
      setOriginalNote('');
      changeToSearchState();
      return;
    }
    changeToUpdateState();
    setRelevantWords(sentence.words);
    setCreateTime(sentence.ctime);
    setModifyTime(sentence.mtime);
    setBelongSentence({ id: sentence.id, text: sentence.sentence });
    editSentenceForm.setFieldValue('sentence', sentence.sentence);
    editSentenceForm.setFieldValue('note', sentence.note);
    setOriginalSentence(sentence.sentence);
    setOriginalNote(sentence.note);
  };

  const editorKeyDown = ctrlSAction(() => editSentenceForm.submit());

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
        <Spin spinning={isSubmitting}>
          <Form
            {...formLayout}
            form={editSentenceForm}
            name="editSentenceForm"
            initialValues={initialValue}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item label={<SearchToolTip />}>
              <Select
                autoFocus
                placeholder="Search sentence"
                options={searchResultOptions}
                onChange={handleSentenceChange}
                onSearch={handleSentenceSearch}
                onBlur={getSentence}
                showSearch
                filterOption={false}
                notFoundContent={isFetchingOptions ? <LoadingInContainer /> : null}
              />
            </Form.Item>
            {isFetchRecordState() && <EditPageSkeleton fieldCountBeforeNoteField={4} />}
            {
              isUpdateState() && (
                <>
                  <SentenceReadOnlyInfo
                    belongSentence={belongSentence}
                    createTime={createTime}
                    modifyTime={modifyTime}
                    words={relevantWords}
                  />
                  <Form.Item label="Sentence" name="sentence" rules={rules.sentence}>
                    <Input onKeyDown={editorKeyDown} />
                  </Form.Item>
                  {/* 这里使用 dependencies ，是因为 note 字段的校验其实是表单的总校验，目的是在 sentence 变化时也触发该校验 */}
                  {/* TODO: 找到更好的做法 */}
                  <Form.Item label="Note" name="note" rules={rules.note} dependencies={['sentence']}>
                    <MarkdownEditor
                      onKeyDown={editorKeyDown}
                      highlightBorder={isNoteChanged}
                    />
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
                isUpdateState() && (
                  <Button className={styles.btn} onClick={cleanNote}>
                    Clean Note
                  </Button>
                )
              }
            </Form.Item>
          </Form>
        </Spin>
      </div>
    </EnLayout>
  );
}
